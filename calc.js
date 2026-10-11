// Pure ROI calculation logic, shared by the browser app and the unit tests.
(function (root) {
  function toNumber(value) {
    const n = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }

  function calculate(budget, categories) {
    const total = Math.max(0, toNumber(budget));

    const rows = categories.map((c) => {
      const share = toNumber(c.share);
      const roi = toNumber(c.roi);
      const invested = (total * share) / 100;
      const profit = (invested * roi) / 100;
      return { ...c, share, roi, invested, profit, revenue: invested + profit };
    });

    const shareSum = rows.reduce((s, r) => s + r.share, 0);
    const invested = rows.reduce((s, r) => s + r.invested, 0);
    const profit = rows.reduce((s, r) => s + r.profit, 0);

    return {
      budget: total,
      rows,
      shareSum,
      invested,
      profit,
      revenue: invested + profit,
      totalRoi: invested > 0 ? (profit / invested) * 100 : 0,
      unallocated: total - invested,
    };
  }

  const api = { calculate, toNumber };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RoiCalc = api;
})(this);
