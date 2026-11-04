// Pure logic for Garden Planner BD — shared by the app and the node tests.
// No DOM access here, so it runs in both browser and node.
(function (root) {
  'use strict';

  var CROPS = [
    { id: 'tomato',    en: 'Tomato',        bn: 'টমেটো',     emoji: '🍅', days: 70,  sow: [10, 11, 12, 1],  season: 'rabi',  sun: 'full', water: 'medium' },
    { id: 'brinjal',   en: 'Brinjal',       bn: 'বেগুন',     emoji: '🍆', days: 60,  sow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], season: 'year', sun: 'full', water: 'medium' },
    { id: 'chilli',    en: 'Chilli',        bn: 'মরিচ',      emoji: '🌶️', days: 75,  sow: [10, 11, 12, 1],  season: 'rabi',  sun: 'full', water: 'low' },
    { id: 'okra',      en: 'Okra',          bn: 'ঢেঁড়স',    emoji: '🥒', days: 50,  sow: [2, 3, 4, 5, 6],   season: 'kharif', sun: 'full', water: 'medium' },
    { id: 'bitter',    en: 'Bitter gourd',  bn: 'করলা',      emoji: '🥒', days: 55,  sow: [2, 3, 4, 5],      season: 'kharif', sun: 'full', water: 'medium' },
    { id: 'bottle',    en: 'Bottle gourd',  bn: 'লাউ',       emoji: '🥒', days: 60,  sow: [2, 3, 4, 5, 6],   season: 'kharif', sun: 'full', water: 'high' },
    { id: 'pumpkin',   en: 'Pumpkin',       bn: 'কুমড়া',     emoji: '🎃', days: 90,  sow: [10, 11, 12, 1],  season: 'rabi',  sun: 'full', water: 'medium' },
    { id: 'cucumber',  en: 'Cucumber',      bn: 'শসা',       emoji: '🥒', days: 50,  sow: [2, 3, 4, 5, 6],   season: 'kharif', sun: 'full', water: 'high' },
    { id: 'cauliflower', en: 'Cauliflower', bn: 'ফুলকপি',    emoji: '🥦', days: 75,  sow: [9, 10, 11],       season: 'rabi',  sun: 'full', water: 'medium' },
    { id: 'cabbage',   en: 'Cabbage',       bn: 'বাঁধাকপি',   emoji: '🥬', days: 80,  sow: [10, 11, 12],      season: 'rabi',  sun: 'full', water: 'medium' },
    { id: 'spinach',   en: 'Spinach',       bn: 'পালং শাক',   emoji: '🥬', days: 35,  sow: [10, 11, 12, 1, 2], season: 'rabi', sun: 'partial', water: 'medium' },
    { id: 'amaranth',  en: 'Red amaranth',  bn: 'লাল শাক',    emoji: '🥬', days: 30,  sow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], season: 'year', sun: 'partial', water: 'medium' },
    { id: 'radish',    en: 'Radish',        bn: 'মুলা',      emoji: '🥕', days: 40,  sow: [10, 11, 12, 1],  season: 'rabi',  sun: 'full', water: 'medium' },
    { id: 'carrot',    en: 'Carrot',        bn: 'গাজর',      emoji: '🥕', days: 70,  sow: [10, 11, 12, 1],  season: 'rabi',  sun: 'full', water: 'low' },
    { id: 'coriander', en: 'Coriander',     bn: 'ধনিয়া',     emoji: '🌿', days: 40,  sow: [10, 11, 12, 1, 2], season: 'rabi', sun: 'partial', water: 'low' },
    { id: 'onion',     en: 'Onion',         bn: 'পেঁয়াজ',    emoji: '🧅', days: 100, sow: [11, 12, 1],       season: 'rabi',  sun: 'full', water: 'low' },
    { id: 'bean',      en: 'Yardlong bean', bn: 'বরবটি',     emoji: '🫘', days: 55,  sow: [2, 3, 4, 5, 6, 7], season: 'kharif', sun: 'full', water: 'medium' },
    { id: 'potato',    en: 'Potato',        bn: 'আলু',       emoji: '🥔', days: 90,  sow: [11, 12, 1],       season: 'rabi',  sun: 'full', water: 'medium' }
  ];

  var ROWS = 4, COLS = 6;

  function cropById(id) {
    for (var i = 0; i < CROPS.length; i++) if (CROPS[i].id === id) return CROPS[i];
    return null;
  }

  function parseDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    var d = new Date(s + 'T00:00:00Z');
    return isNaN(d.getTime()) ? null : d;
  }

  function fmtDate(d) {
    return d.toISOString().slice(0, 10);
  }

  function addDays(dateStr, n) {
    var d = parseDate(dateStr);
    if (!d) return null;
    d.setUTCDate(d.getUTCDate() + n);
    return fmtDate(d);
  }

  function harvestDate(planted, cropId) {
    var c = cropById(cropId);
    if (!c || !parseDate(planted)) return null;
    return addDays(planted, c.days);
  }

  // Whole days from `today` until the harvest date. Negative = overdue.
  function daysLeft(planted, cropId, today) {
    var h = harvestDate(planted, cropId);
    var t = parseDate(today);
    if (!h || !t) return null;
    return Math.round((parseDate(h) - t) / 86400000);
  }

  function sowableInMonth(cropId, month) {
    var c = cropById(cropId);
    if (!c || month < 1 || month > 12) return false;
    return c.sow.indexOf(month) !== -1;
  }

  function cropsForMonth(month) {
    return CROPS.filter(function (c) { return c.sow.indexOf(month) !== -1; });
  }

  function emptyBed() {
    var cells = [];
    for (var i = 0; i < ROWS * COLS; i++) cells.push(null);
    return cells;
  }

  function bedStats(cells, today) {
    var planted = 0, ready = 0, growing = 0;
    cells.forEach(function (cell) {
      if (!cell) return;
      planted++;
      var dl = daysLeft(cell.planted, cell.cropId, today);
      if (dl !== null && dl <= 0) ready++; else growing++;
    });
    return { planted: planted, ready: ready, growing: growing, free: ROWS * COLS - planted };
  }

  function isFutureDate(dateStr, today) {
    var d = parseDate(dateStr), t = parseDate(today);
    if (!d || !t) return false;
    return d > t;
  }

  // Strict import validation: returns { ok: true, data } or { ok: false, error }.
  function validateImport(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'not-object' };
    if (raw.app !== 'garden-planner-bd') return { ok: false, error: 'wrong-app' };
    if (!Array.isArray(raw.cells) || raw.cells.length !== ROWS * COLS) return { ok: false, error: 'bad-cells' };
    for (var i = 0; i < raw.cells.length; i++) {
      var cell = raw.cells[i];
      if (cell === null) continue;
      if (typeof cell !== 'object' || !cropById(cell.cropId) || !parseDate(cell.planted)) return { ok: false, error: 'bad-cell' };
    }
    if (!Array.isArray(raw.care)) return { ok: false, error: 'bad-care' };
    for (var j = 0; j < raw.care.length; j++) {
      var e = raw.care[j];
      if (typeof e !== 'object' || !parseDate(e.date) || ['water', 'fertilize', 'weed', 'pest'].indexOf(e.type) === -1) return { ok: false, error: 'bad-care-entry' };
    }
    if (!Array.isArray(raw.harvested)) return { ok: false, error: 'bad-harvested' };
    for (var k = 0; k < raw.harvested.length; k++) {
      var h = raw.harvested[k];
      if (typeof h !== 'object' || !cropById(h.cropId) || !parseDate(h.planted) || !parseDate(h.harvested)) return { ok: false, error: 'bad-harvested-entry' };
    }
    return { ok: true, data: { cells: raw.cells, care: raw.care, harvested: raw.harvested } };
  }

  var api = {
    CROPS: CROPS, ROWS: ROWS, COLS: COLS, cropById: cropById, parseDate: parseDate,
    fmtDate: fmtDate, addDays: addDays, harvestDate: harvestDate, daysLeft: daysLeft,
    sowableInMonth: sowableInMonth, cropsForMonth: cropsForMonth, emptyBed: emptyBed,
    bedStats: bedStats, isFutureDate: isFutureDate, validateImport: validateImport
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GardenLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
