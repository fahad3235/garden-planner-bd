// Garden Planner BD — UI wiring. State lives only in localStorage.
(function () {
  'use strict';
  var L = window.GardenLogic;
  var I18N = window.GardenI18n;
  var KEY = 'garden-planner-bd-v1';

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && Array.isArray(raw.cells) && raw.cells.length === L.ROWS * L.COLS) {
        return { lang: raw.lang === 'bn' ? 'bn' : 'en', cells: raw.cells, care: raw.care || [], harvested: raw.harvested || [] };
      }
    } catch (e) { /* corrupted state -> fresh start */ }
    return { lang: 'en', cells: L.emptyBed(), care: [], harvested: [] };
  }

  var state = load();
  var selectedCell = -1;
  var selectedCrop = '';
  var calMonth = new Date().getMonth() + 1;

  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function t(k) { return I18N.STR[state.lang][k]; }
  function num(s) { return I18N.localizeNum(s, state.lang); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderStatic() {
    setText('title', t('title')); setText('tagline', t('tagline'));
    ['tabGarden', 'tabCrops', 'tabCalendar', 'tabCare', 'tabData'].forEach(function (k) {
      document.querySelectorAll('[data-tabbtn="' + k + '"]').forEach(function (el) { el.textContent = t(k); });
    });
    setText('langBtn', t('langBtn'));
    setText('gardenH', t('gardenH')); setText('gardenP', t('gardenP'));
    setText('cropsH', t('cropsH')); setText('cropsP', t('cropsP'));
    setText('calH', t('calH')); setText('calP', t('calP'));
    setText('careH', t('careH')); setText('careP', t('careP'));
    setText('dataH', t('dataH')); setText('dataP', t('dataP'));
    setText('plantPickerH', t('plantPicker')); setText('plantDateL', t('plantDate'));
    setText('plantBtn', t('plantBtn')); setText('careTypeL', t('careType'));
    setText('careNoteL', t('careNote')); setText('careAdd', t('careAdd'));
    setText('exportBtn', t('exportBtn')); setText('importBtn', t('importBtn'));
    setText('eraseBtn', t('eraseBtn')); setText('harvestedH', t('harvestedH'));
    setText('disclaimer', t('disclaimer'));
    document.getElementById('careType').innerHTML =
      '<option value="">—</option>' +
      ['water', 'fertilize', 'weed', 'pest'].map(function (k) {
        return '<option value="' + k + '">' + esc(t('care' + k.charAt(0).toUpperCase() + k.slice(1))) + '</option>';
      }).join('');
    var monthSel = document.getElementById('calMonth');
    monthSel.innerHTML = t('months').map(function (m, i) {
      return '<option value="' + (i + 1) + '"' + (i + 1 === calMonth ? ' selected' : '') + '>' + esc(m) + '</option>';
    }).join('');
    var cropSel = document.getElementById('cropSel');
    cropSel.innerHTML = '<option value="">—</option>' + L.CROPS.map(function (c) {
      return '<option value="' + c.id + '"' + (c.id === selectedCrop ? ' selected' : '') + '>' + c.emoji + ' ' + esc(state.lang === 'bn' ? c.bn : c.en) + '</option>';
    }).join('');
  }

  function renderGarden() {
    var stats = L.bedStats(state.cells, todayStr());
    setText('statPlanted', num(stats.planted) + ' ' + t('statsPlanted'));
    setText('statReady', num(stats.ready) + ' ' + t('statsReady'));
    setText('statGrowing', num(stats.growing) + ' ' + t('statsGrowing'));
    setText('statFree', num(stats.free) + ' ' + t('statsFree'));
    var grid = document.getElementById('bedGrid');
    grid.innerHTML = state.cells.map(function (cell, i) {
      if (!cell) return '<button class="plot empty' + (i === selectedCell ? ' sel' : '') + '" data-plot="' + i + '" aria-label="Plot ' + (i + 1) + '">+' + num(i + 1) + '</button>';
      var c = L.cropById(cell.cropId);
      var dl = L.daysLeft(cell.planted, cell.cropId, todayStr());
      var cls = dl !== null && dl <= 0 ? ' ready' : '';
      return '<button class="plot' + cls + (i === selectedCell ? ' sel' : '') + '" data-plot="' + i + '" aria-label="Plot ' + (i + 1) + '">' + c.emoji + '<span>' + esc(state.lang === 'bn' ? c.bn : c.en) + '</span>' +
        '<small>' + (dl !== null && dl <= 0 ? '✓' : num(Math.max(dl, 0)) + 'd') + '</small></button>';
    }).join('');
    grid.querySelectorAll('[data-plot]').forEach(function (btn) {
      btn.addEventListener('click', function () { selectedCell = +btn.dataset.plot; renderGarden(); });
    });
    // Detail panel
    var panel = document.getElementById('plotPanel');
    var err = document.getElementById('plantErr');
    err.textContent = '';
    if (selectedCell < 0) { panel.innerHTML = '<p class="muted">' + esc(t('noPlot')) + '</p>'; return; }
    var cell = state.cells[selectedCell];
    if (!cell) {
      panel.innerHTML = '<p><strong>' + esc(t('plantPicker')) + ' — ' + t('tabGarden') + ' ' + num(selectedCell + 1) + '</strong></p>';
      return;
    }
    var c = L.cropById(cell.cropId);
    var dl = L.daysLeft(cell.planted, cell.cropId, todayStr());
    var hd = L.harvestDate(cell.planted, cell.cropId);
    panel.innerHTML = '<p><strong>' + c.emoji + ' ' + esc(state.lang === 'bn' ? c.bn : c.en) + '</strong> — ' + esc(t('occupied')) + '</p>' +
      '<p>' + esc(t('plantedOn')) + ': ' + num(cell.planted) + ' · ' + esc(t('harvestOn')) + ': ' + num(hd) + '</p>' +
      '<p>' + (dl !== null && dl <= 0 ? '<strong>' + esc(t('readyNow')) + '</strong>' : esc(t('daysLeft')) + ': ' + num(dl)) + '</p>' +
      '<button id="harvestBtn" class="btn primary">' + esc(t('harvestBtn')) + '</button> ' +
      '<button id="clearBtn" class="btn danger">' + esc(t('clearBtn')) + '</button>';
    document.getElementById('harvestBtn').addEventListener('click', function () {
      state.harvested.unshift({ cropId: cell.cropId, planted: cell.planted, harvested: todayStr() });
      state.cells[selectedCell] = null; selectedCell = -1; save();
      setText('msg', t('harvestedMsg')); renderAll();
    });
    document.getElementById('clearBtn').addEventListener('click', function () {
      state.cells[selectedCell] = null; selectedCell = -1; save();
      setText('msg', t('cleared')); renderAll();
    });
  }

  function renderCrops() {
    var list = document.getElementById('cropList');
    list.innerHTML = L.CROPS.map(function (c) {
      var seasonKey = c.season === 'rabi' ? 'seasonRabi' : c.season === 'kharif' ? 'seasonKharif' : 'seasonYear';
      var sunKey = c.sun === 'full' ? 'sunFull' : 'sunPartial';
      var waterKey = c.water === 'low' ? 'waterLow' : c.water === 'high' ? 'waterHigh' : 'waterMedium';
      return '<div class="card"><div class="card-emoji">' + c.emoji + '</div><div><strong>' + esc(state.lang === 'bn' ? c.bn : c.en) +
        '</strong><div class="muted">' + num(c.days) + ' ' + esc(t('daysToHarvest')) + ' · ' + esc(t(seasonKey)) + ' · ' + esc(t(sunKey)) + ' · ' + esc(t(waterKey)) +
        '</div><div class="muted">' + esc(t('sowThisMonth')) + ': ' + c.sow.map(function (m) { return t('months')[m - 1]; }).join(', ') + '</div></div></div>';
    }).join('');
  }

  function renderCalendar() {
    var list = document.getElementById('calList');
    var crops = L.cropsForMonth(calMonth);
    setText('calTitle', t('months')[calMonth - 1] + (calMonth === new Date().getMonth() + 1 ? ' · ' + t('monthNow') : ''));
    if (!crops.length) { list.innerHTML = '<p class="muted">' + esc(t('noneMonth')) + '</p>'; return; }
    list.innerHTML = '<p>' + esc(t('sowThisMonth')) + ': ' + num(crops.length) + '</p>' +
      crops.map(function (c) {
        return '<div class="card"><div class="card-emoji">' + c.emoji + '</div><div><strong>' + esc(state.lang === 'bn' ? c.bn : c.en) +
          '</strong><div class="muted">' + num(c.days) + ' ' + esc(t('daysToHarvest')) + '</div></div></div>';
      }).join('');
  }

  function renderCare() {
    var list = document.getElementById('careList');
    if (!state.care.length) { list.innerHTML = '<p class="muted">' + esc(t('careEmpty')) + '</p>'; return; }
    list.innerHTML = state.care.map(function (e, i) {
      var label = t('care' + e.type.charAt(0).toUpperCase() + e.type.slice(1));
      return '<div class="row"><span>' + num(e.date) + ' — ' + esc(label) + (e.note ? ' · ' + esc(e.note) : '') + '</span>' +
        '<button class="btn small" data-del-care="' + i + '">✕</button></div>';
    }).join('');
    list.querySelectorAll('[data-del-care]').forEach(function (btn) {
      btn.addEventListener('click', function () { state.care.splice(+btn.dataset.delCare, 1); save(); renderCare(); });
    });
  }

  function renderHarvested() {
    var list = document.getElementById('harvestedList');
    if (!state.harvested.length) { list.innerHTML = '<p class="muted">' + esc(t('harvestedEmpty')) + '</p>'; return; }
    list.innerHTML = state.harvested.map(function (h) {
      var c = L.cropById(h.cropId);
      return '<div class="row"><span>' + c.emoji + ' ' + esc(state.lang === 'bn' ? c.bn : c.en) + ' — ' + num(h.harvested) + '</span></div>';
    }).join('');
  }

  function renderAll() { renderStatic(); renderGarden(); renderCrops(); renderCalendar(); renderCare(); renderHarvested(); }

  function switchTab(tab) {
    document.querySelectorAll('[data-tabbtn]').forEach(function (b) { b.classList.toggle('active', b.dataset.tabbtn === tab); });
    document.querySelectorAll('.tab').forEach(function (s) { s.classList.toggle('active', s.id === 'tab-' + tab.replace('tab', '').toLowerCase()); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-tabbtn]').forEach(function (b) {
      b.addEventListener('click', function () { switchTab(b.dataset.tabbtn); });
    });
    document.getElementById('langBtn').addEventListener('click', function () {
      state.lang = state.lang === 'en' ? 'bn' : 'en'; save(); renderAll();
    });
    document.getElementById('plantBtn').addEventListener('click', function () {
      var err = document.getElementById('plantErr'); err.textContent = '';
      if (selectedCell < 0 || state.cells[selectedCell]) { err.textContent = t('noPlot'); return; }
      if (!selectedCrop) { err.textContent = t('errNoCrop'); return; }
      var date = document.getElementById('plantDate').value || todayStr();
      if (L.isFutureDate(date, todayStr())) { err.textContent = t('errFuture'); return; }
      state.cells[selectedCell] = { cropId: selectedCrop, planted: date };
      save(); setText('msg', t('plantedMsg')); renderAll();
    });
    document.getElementById('cropSel').addEventListener('change', function (e) { selectedCrop = e.target.value; });
    document.getElementById('plantDate').value = todayStr();
    document.getElementById('calMonth').addEventListener('change', function (e) { calMonth = +e.target.value; renderCalendar(); });
    document.getElementById('careAdd').addEventListener('click', function () {
      var err = document.getElementById('careErr'); err.textContent = '';
      var type = document.getElementById('careType').value;
      var date = document.getElementById('careDate').value || todayStr();
      if (!type) { err.textContent = t('errNoType'); return; }
      if (L.isFutureDate(date, todayStr())) { err.textContent = t('errFuture'); return; }
      state.care.unshift({ date: date, type: type, note: document.getElementById('careNote').value.trim() });
      document.getElementById('careNote').value = ''; save(); renderCare();
    });
    document.getElementById('careDate').value = todayStr();
    document.getElementById('exportBtn').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify({ app: 'garden-planner-bd', cells: state.cells, care: state.care, harvested: state.harvested }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'garden-planner-bd-backup.json'; a.click();
      URL.revokeObjectURL(a.href);
    });
    document.getElementById('importFile').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var res = L.validateImport(JSON.parse(r.result));
          if (!res.ok) throw new Error(res.error);
          state.cells = res.data.cells; state.care = res.data.care; state.harvested = res.data.harvested;
          selectedCell = -1; save(); setText('msg', t('importOk')); renderAll();
        } catch (err) { setText('msg', t('importBad')); }
      };
      r.readAsText(f); e.target.value = '';
    });
    document.getElementById('eraseBtn').addEventListener('click', function () {
      var v = prompt(t('erasePrompt'));
      if (v === 'DELETE') {
        state = { lang: state.lang, cells: L.emptyBed(), care: [], harvested: [] };
        selectedCell = -1; save(); setText('msg', t('eraseDone')); renderAll();
      }
    });
    renderAll();
  });
})();
