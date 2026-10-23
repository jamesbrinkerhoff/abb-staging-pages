// Netlify Function (Node 18+, no deps): Meta Conversions API "Schedule" for /success-call.
// POST {event_id, fbp?, fbc?, page_url?}. Uses the same event_id as the browser pixel's Schedule,
// so Meta dedupes the pair (same event_name + event_id from pixel and server).
// Env: META_CAPI_TOKEN (required, secret), META_TEST_EVENT_CODE (optional, test mode only).
'use strict';
const PIXEL_ID = '4598310753722166';
const GRAPH = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;
const ALLOWED_HOSTS = new Set(['vip.soniagomez.net', 'soniagomez.net', 'www.soniagomez.net']);
const EVENT_ID_RE = /^[A-Za-z0-9._:-]{8,100}$/;
const FBP_RE = /^fb\.\d\.\d{10,16}\.\d{1,25}$/;
const FBC_RE = /^fb\.\d\.\d{10,16}\..{1,500}$/;

function hostOf(u) { try { return new URL(u).hostname; } catch (_) { return ''; } }
function lower(h) { const o = {}; for (const k of Object.keys(h || {})) o[k.toLowerCase()] = h[k]; return o; }
function cors(origin) {
  const h = { 'content-type': 'application/json', 'cache-control': 'no-store' };
  if (origin && ALLOWED_HOSTS.has(hostOf(origin)) && origin.startsWith('https://')) {
    h['access-control-allow-origin'] = origin; h['vary'] = 'Origin';
    h['access-control-allow-methods'] = 'POST, OPTIONS'; h['access-control-allow-headers'] = 'content-type';
  }
  return h;
}
function reply(status, body, origin) { return { statusCode: status, headers: cors(origin), body: JSON.stringify(body) }; }

function buildPayload({ event_id, fbp, fbc, page_url }, { ip, ua, origin, now, testCode }) {
  const pageHost = hostOf(page_url);
  const source = (page_url && ALLOWED_HOSTS.has(pageHost) && page_url.startsWith('https://'))
    ? page_url.split('#')[0].slice(0, 1000)
    : `${origin}/success-call/`;
  const user_data = {};
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua.slice(0, 1000);
  if (typeof fbp === 'string' && FBP_RE.test(fbp)) user_data.fbp = fbp;
  if (typeof fbc === 'string' && FBC_RE.test(fbc)) user_data.fbc = fbc;
  const payload = {
    data: [{
      event_name: 'Schedule',
      event_time: Math.floor((now || Date.now()) / 1000),
      event_id,
      action_source: 'website',
      event_source_url: source,
      user_data,
      custom_data: { content_name: 'Success Call with Sonia' },
    }],
  };
  if (testCode) payload.test_event_code = testCode;
  return payload;
}

async function handler(event, _ctx, deps = {}) {
  const env = deps.env || process.env;
  const doFetch = deps.fetch || fetch;
  const h = lower(event.headers);
  let origin = h.origin || '';
  if (!origin && h.referer) { try { origin = new URL(h.referer).origin; } catch (_) {} }
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors(origin), body: '' };
  if (event.httpMethod !== 'POST') return reply(405, { ok: false, error: 'method' }, origin);
  if (!origin.startsWith('https://') || !ALLOWED_HOSTS.has(hostOf(origin))) return reply(403, { ok: false, error: 'origin' }, '');

  let body;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '');
    if (raw.length > 4000) return reply(413, { ok: false, error: 'size' }, origin);
    body = JSON.parse(raw || '{}');
  } catch (_) { return reply(400, { ok: false, error: 'json' }, origin); }
  if (typeof body.event_id !== 'string' || !EVENT_ID_RE.test(body.event_id)) return reply(400, { ok: false, error: 'event_id' }, origin);

  const token = env.META_CAPI_TOKEN;
  if (!token) return reply(500, { ok: false, error: 'not_configured' }, origin);

  const ip = (h['x-nf-client-connection-ip'] || (h['x-forwarded-for'] || '').split(',')[0] || '').trim();
  const payload = buildPayload(body, { ip, ua: h['user-agent'] || '', origin, testCode: env.META_TEST_EVENT_CODE || '' });

  try {
    const res = await doFetch(GRAPH, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, access_token: token }), // token in body, never in the URL or logs
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.log('capi-schedule graph error', res.status, j && j.error && j.error.message, j && j.error && j.error.fbtrace_id);
      return reply(502, { ok: false, error: 'graph', status: res.status, fbtrace_id: j && j.error && j.error.fbtrace_id }, origin);
    }
    return reply(200, { ok: true, events_received: j.events_received, fbtrace_id: j.fbtrace_id, test: !!payload.test_event_code }, origin);
  } catch (e) {
    console.log('capi-schedule fetch failed', String(e && e.message));
    return reply(502, { ok: false, error: 'network' }, origin);
  }
}

exports.handler = handler;
exports._internal = { buildPayload, ALLOWED_HOSTS, PIXEL_ID, GRAPH };
