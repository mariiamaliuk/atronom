(function () {
  const STORAGE_KEY = 'roi-budget-v1';
  const DEFAULT_STATE = {
    budget: 100000,
    categories: [
      { name: 'Social media', share: 50, roi: 20 },
      { name: 'Strona www', share: 30, roi: 10 },
      { name: 'Radio', share: 20, roi: 5 },
    ],
  };

  const money = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 2 });
  const pct = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 2 });

  const $ = (id) => document.getElementById(id);
  const budgetInput = $('budget');
  const rowsEl = $('rows');
  const template = $('row-template');

  let state = load();

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.categories)) return saved;
    } catch (e) { /* storage unavailable or corrupt */ }
    return clone(DEFAULT_STATE);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* storage unavailable */ }
  }

  function renderRows() {
    rowsEl.replaceChildren();
    state.categories.forEach((cat, i) => {
      const tr = template.content.firstElementChild.cloneNode(true);
      tr.dataset.index = i;
      tr.querySelector('.name').value = cat.name;
      tr.querySelector('.share').value = cat.share;
      tr.querySelector('.roi').value = cat.roi;
      rowsEl.appendChild(tr);
    });
  }

  function update() {
    const result = RoiCalc.calculate(state.budget, state.categories);

    budgetInput.classList.toggle('invalid', RoiCalc.toNumber(state.budget) < 0);

    result.rows.forEach((row, i) => {
      const tr = rowsEl.children[i];
      tr.querySelector('.share').classList.toggle('invalid', row.share < 0 || row.share > 100);
      tr.querySelector('.invested').textContent = money.format(row.invested);
      const profitEl = tr.querySelector('.profit');
      profitEl.textContent = money.format(row.profit);
      profitEl.classList.toggle('negative', row.profit < 0);
      tr.querySelector('.revenue').textContent = money.format(row.revenue);
    });

    const sumBadge = $('share-sum');
    const sum = Math.round(result.shareSum * 100) / 100;
    sumBadge.textContent = `Suma: ${pct.format(sum)}%`;
    sumBadge.className = 'badge ' + (sum === 100 ? 'ok' : sum < 100 ? 'warn' : 'error');

    const alert = $('alert');
    if (sum < 100) {
      alert.hidden = false;
      alert.className = 'alert warn';
      alert.textContent = `Nieprzydzielone ${pct.format(100 - sum)}% budżetu (${money.format(result.unallocated)}) — nie jest wliczane do ROI.`;
    } else if (sum > 100) {
      alert.hidden = false;
      alert.className = 'alert error';
      alert.textContent = `Suma udziałów przekracza 100% o ${pct.format(sum - 100)}% (${money.format(-result.unallocated)} ponad budżet).`;
    } else {
      alert.hidden = true;
    }

    $('sum-invested').textContent = money.format(result.invested);
    const profitEl = $('sum-profit');
    profitEl.textContent = money.format(result.profit);
    profitEl.classList.toggle('negative', result.profit < 0);
    const roiEl = $('sum-roi');
    roiEl.textContent = `${pct.format(result.totalRoi)}%`;
    roiEl.classList.toggle('negative', result.totalRoi < 0);
    $('sum-revenue').textContent = money.format(result.revenue);

    save();
  }

  budgetInput.addEventListener('input', () => {
    state.budget = budgetInput.value;
    update();
  });

  rowsEl.addEventListener('input', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const cat = state.categories[Number(tr.dataset.index)];
    for (const field of ['name', 'share', 'roi']) {
      if (e.target.classList.contains(field)) cat[field] = e.target.value;
    }
    update();
  });

  rowsEl.addEventListener('click', (e) => {
    if (!e.target.classList.contains('del')) return;
    state.categories.splice(Number(e.target.closest('tr').dataset.index), 1);
    renderRows();
    update();
  });

  $('add').addEventListener('click', () => {
    state.categories.push({ name: 'Nowa kategoria', share: 0, roi: 0 });
    renderRows();
    update();
    const last = rowsEl.lastElementChild.querySelector('.name');
    last.focus();
    last.select();
  });

  $('reset').addEventListener('click', () => {
    state = clone(DEFAULT_STATE);
    budgetInput.value = state.budget;
    renderRows();
    update();
  });

  budgetInput.value = state.budget;
  renderRows();
  update();
})();
