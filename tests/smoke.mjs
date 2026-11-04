// Headless smoke test (local QA harness, NOT pushed). Run: node tests/smoke.mjs
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
const PORT = 9335;
const BIN = process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell';
const URL = 'file://' + process.env.HOME + '/workspace/muse-project-factory/builds/garden-planner-bd/index.html';
const proc = spawn(BIN, ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', `--remote-debugging-port=${PORT}`, 'about:blank'], { stdio: 'ignore' });
let checks = 0, fails = [];
function check(name, cond, extra = '') { checks++; if (!cond) fails.push(name + ' ' + extra); else console.log('ok: ' + name); }
try {
  let targets = [];
  for (let i = 0; i < 30 && !targets.length; i++) { await sleep(500); try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); } catch {} }
  const put = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(URL)}`, { method: 'PUT' });
  const t = await put.json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }); return r.result?.result?.value; };
  await sleep(1500);
  check('title', (await ev('document.title')).includes('Garden Planner'), await ev('document.title'));
  check('24 plots rendered', (await ev(`document.querySelectorAll('.plot').length`)) === 24);
  check('18 crop cards rendered', (await ev(`document.querySelectorAll('#cropList .card').length`)) === 18);
  check('stats show 24 free', (await ev(`document.getElementById('statFree').textContent`)).includes('24'));
  // plant: select plot 1, pick tomato, plant
  await ev(`document.querySelector('[data-plot="0"]').click()`); await sleep(200);
  await ev(`document.getElementById('cropSel').value='tomato'; document.getElementById('cropSel').dispatchEvent(new Event('change')); document.getElementById('plantDate').value='2026-11-04'; document.getElementById('plantBtn').click()`); await sleep(400);
  check('planted msg shown', (await ev(`document.getElementById('msg').textContent`)).includes('Planted'));
  check('stats show 1 planted, 23 free', (await ev(`document.getElementById('statPlanted').textContent`)).includes('1') && (await ev(`document.getElementById('statFree').textContent`)).includes('23'));
  // reload persistence
  await send('Page.reload', { ignoreCache: true }); await sleep(1500);
  check('plant persists after reload', (await ev(`document.getElementById('statPlanted').textContent`)).includes('1'));
  // harvest the planted plot
  await ev(`document.querySelector('[data-plot="0"]').click()`); await sleep(200);
  await ev(`document.getElementById('harvestBtn').click()`); await sleep(400);
  check('harvest recorded', (await ev(`document.getElementById('msg').textContent`)).includes('Harvest recorded'));
  check('harvest history has 1 row', (await ev(`document.querySelectorAll('#harvestedList .row').length`)) === 1);
  // care log: future date rejected, then valid entry
  await ev(`document.querySelector('[data-tabbtn="tabCare"]').click()`); await sleep(200);
  await ev(`document.getElementById('careType').value='water'; document.getElementById('careDate').value='2099-01-01'; document.getElementById('careAdd').click()`); await sleep(300);
  check('future care date inline error', (await ev(`document.getElementById('careErr').textContent`)).length > 0);
  await ev(`document.getElementById('careDate').value='2026-11-04'; document.getElementById('careAdd').click()`); await sleep(300);
  check('care row added', (await ev(`document.querySelectorAll('#careList .row').length`)) === 1);
  // calendar: November lists tomato
  await ev(`document.querySelector('[data-tabbtn="tabCalendar"]').click()`); await sleep(200);
  await ev(`document.getElementById('calMonth').value='11'; document.getElementById('calMonth').dispatchEvent(new Event('change'))`); await sleep(300);
  check('November calendar lists crops', (await ev(`document.querySelectorAll('#calList .card').length`)) >= 10);
  // BN toggle
  await ev(`document.getElementById('langBtn').click()`); await sleep(300);
  check('BN toggle renders Bengali title', (await ev(`document.getElementById('title').textContent`)).includes('গার্ডেন'));
  // mobile overflow
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(300);
  const sw = await ev('document.documentElement.scrollWidth');
  check('390px no overflow', sw <= 390, 'scrollWidth=' + sw);
  ws.close();
} finally { proc.kill('SIGKILL'); }
console.log(`${checks - fails.length}/${checks} smoke checks passed`);
if (fails.length) { console.error('FAILURES:', fails); process.exit(1); }
