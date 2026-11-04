// Node unit tests for js/logic.js. Run: node tests/logic.test.js
const assert = require('node:assert');
const L = require('../js/logic.js');
let n = 0;
function ok(name, cond) { n++; assert.ok(cond, name); console.log('ok: ' + name); }

ok('18 crops in library', L.CROPS.length === 18);
ok('cropById tomato = 70 days', L.cropById('tomato').days === 70);
ok('cropById unknown = null', L.cropById('nope') === null);
ok('harvestDate tomato planted 2026-11-04 = 2027-01-13', L.harvestDate('2026-11-04', 'tomato') === '2027-01-13');
ok('harvestDate bad date = null', L.harvestDate('junk', 'tomato') === null);
ok('harvestDate bad crop = null', L.harvestDate('2026-11-04', 'nope') === null);
ok('daysLeft tomato planted 2026-11-04, today 2026-11-04 = 70', L.daysLeft('2026-11-04', 'tomato', '2026-11-04') === 70);
ok('daysLeft spinach 35d planted 2026-09-01, today 2026-11-04 = -29 (overdue)', L.daysLeft('2026-09-01', 'spinach', '2026-11-04') === -29);
ok('tomato sowable in November', L.sowableInMonth('tomato', 11) === true);
ok('tomato not sowable in June', L.sowableInMonth('tomato', 6) === false);
ok('brinjal sowable every month', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].every(function (m) { return L.sowableInMonth('brinjal', m); }));
ok('November crops include tomato, onion, potato; exclude okra', (function () {
  const ids = L.cropsForMonth(11).map(function (c) { return c.id; });
  return ids.includes('tomato') && ids.includes('onion') && ids.includes('potato') && !ids.includes('okra');
})());
ok('emptyBed has 24 null cells', L.emptyBed().length === 24 && L.emptyBed().every(function (c) { return c === null; }));
ok('bedStats counts planted/ready/growing/free', (function () {
  const cells = L.emptyBed();
  cells[0] = { cropId: 'spinach', planted: '2026-09-01' }; // overdue -> ready
  cells[1] = { cropId: 'tomato', planted: '2026-11-04' };  // growing
  const s = L.bedStats(cells, '2026-11-04');
  return s.planted === 2 && s.ready === 1 && s.growing === 1 && s.free === 22;
})());
ok('isFutureDate rejects future, accepts past', L.isFutureDate('2099-01-01', '2026-11-04') === true && L.isFutureDate('2026-11-03', '2026-11-04') === false);
ok('validateImport accepts a good backup', (function () {
  const cells = L.emptyBed(); cells[0] = { cropId: 'tomato', planted: '2026-11-04' };
  return L.validateImport({ app: 'garden-planner-bd', cells: cells, care: [{ date: '2026-11-04', type: 'water', note: '' }], harvested: [] }).ok === true;
})());
ok('validateImport rejects wrong app', L.validateImport({ app: 'other', cells: L.emptyBed(), care: [], harvested: [] }).ok === false);
ok('validateImport rejects bad cell crop', (function () {
  const cells = L.emptyBed(); cells[0] = { cropId: 'nope', planted: '2026-11-04' };
  return L.validateImport({ app: 'garden-planner-bd', cells: cells, care: [], harvested: [] }).ok === false;
})());
ok('validateImport rejects bad care type', L.validateImport({ app: 'garden-planner-bd', cells: L.emptyBed(), care: [{ date: '2026-11-04', type: 'dance' }], harvested: [] }).ok === false);
ok('validateImport rejects 23 cells', L.validateImport({ app: 'garden-planner-bd', cells: L.emptyBed().slice(1), care: [], harvested: [] }).ok === false);
ok('every crop has en, bn, emoji, days, sow months', L.CROPS.every(function (c) {
  return c.en && c.bn && c.emoji && c.days > 0 && Array.isArray(c.sow) && c.sow.length > 0 && c.sow.every(function (m) { return m >= 1 && m <= 12; });
}));
console.log(n + '/' + n + ' unit tests passed');
