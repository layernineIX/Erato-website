import { CODES } from './codes.js';

const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const okEmail = (e) => typeof e === 'string' && e.length < 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const norm = (e) => e.trim().toLowerCase();

async function evaluate(env, code, email, sub) {
  const c = CODES[code];
  if (!c) return { error: 'That code is not valid.' };
  if (c.expires && new Date() > new Date(c.expires + 'T23:59:59Z')) return { error: 'That code has expired.' };
  if (c.min && sub < c.min) return { error: 'This code needs a bag of at least USD ' + c.min + '.' };
  if (c.uses) {
    const n = parseInt((await env.USED.get('u:' + code)) || '0', 10);
    if (n >= c.uses) return { error: 'That code has already been used.' };
  }
  if (c.perEmail) {
    if (!okEmail(email)) return { needEmail: true, error: 'Enter your email to use this code.' };
    if (await env.USED.get('e:' + code + ':' + norm(email))) return { error: 'This code has already been used with that email.' };
  }
  return { ok: true, def: c };
}

async function handleCode(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'Forbidden' }, 403);
  let b; try { b = await request.json(); } catch (e) { return json({ error: 'Bad request' }, 400); }
  const code = String(b.code || '').trim().toUpperCase().slice(0, 30);
  const sub = Number(b.sub) || 0;

  if (b.action === 'check') {
    const r = await evaluate(env, code, b.email, sub);
    if (!r.ok) return json({ ok: false, needEmail: !!r.needEmail, error: r.error });
    const d = r.def;
    return json({ ok: true, code, type: d.type, value: d.value, label: d.label, min: d.min || 0 });
  }

  if (b.action === 'redeem') {
    /* Called after a successful payment. */
    const r = await evaluate(env, code, b.email, sub);
    const d = CODES[code];
    if (!d) return json({ ok: false });
    if (d.uses) {
      const n = parseInt((await env.USED.get('u:' + code)) || '0', 10);
      await env.USED.put('u:' + code, String(n + 1));
    }
    if (d.perEmail) {
      for (const e of [b.email, b.payerEmail]) {
        if (okEmail(e)) await env.USED.put('e:' + code + ':' + norm(e), String(b.orderId || '1'));
      }
    }
    return json({ ok: true, counted: !!r.ok });
  }
  return json({ error: 'Bad request' }, 400);
}

async function handleJoin(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'Forbidden' }, 403);
  let b; try { b = await request.json(); } catch (e) { return json({ error: 'Bad request' }, 400); }
  if (!okEmail(b.email)) return json({ ok: false, error: 'Invalid email' }, 400);
  await env.USED.put('s:' + norm(b.email), new Date().toISOString());
  return json({ ok: true });
}

async function handleExport(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key') || '';
  if (!env.ADMIN_KEY || key.length !== env.ADMIN_KEY.length || key !== env.ADMIN_KEY) return new Response('Not found', { status: 404 });
  const rows = ['email,signed_up'];
  let cursor;
  do {
    const page = await env.USED.list({ prefix: 's:', cursor });
    for (const k of page.keys) {
      const when = (await env.USED.get(k.name)) || '';
      rows.push(k.name.slice(2).replace(/"/g, '') + ',' + when);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return new Response(rows.join('\n') + '\n', { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="erato-list.csv"', 'cache-control': 'no-store' } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/code') {
      try { return await handleCode(request, env); } catch (e) { return json({ ok: false, error: 'Could not check the code. Try again.' }, 500); }
    }
    if (url.pathname === '/api/export') {
      try { return await handleExport(request, env); } catch (e) { return new Response('Error', { status: 500 }); }
    }
    if (url.pathname === '/api/join') {
      try { return await handleJoin(request, env); } catch (e) { return json({ ok: false }, 500); }
    }
    return env.ASSETS.fetch(request);
  }
};
