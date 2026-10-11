const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate, toNumber } = require('./calc.js');

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('acceptance example from PRD', () => {
  const r = calculate(100000, [
    { name: 'Social media', share: 50, roi: 20 },
    { name: 'Strona www', share: 30, roi: 10 },
    { name: 'Radio', share: 20, roi: 5 },
  ]);
  close(r.invested, 100000);
  close(r.profit, 14000);
  close(r.totalRoi, 14);
  close(r.revenue, 114000);
  close(r.shareSum, 100);
  close(r.unallocated, 0);
});

test('per-category amounts', () => {
  const r = calculate(10000, [{ name: 'Radio', share: 25, roi: -20 }]);
  close(r.rows[0].invested, 2500);
  close(r.rows[0].profit, -500);
  close(r.rows[0].revenue, 2000);
});

test('unallocated budget is excluded from ROI', () => {
  const r = calculate(1000, [{ name: 'A', share: 50, roi: 10 }]);
  close(r.invested, 500);
  close(r.unallocated, 500);
  close(r.totalRoi, 10);
});

test('over-allocation is reported', () => {
  const r = calculate(1000, [
    { name: 'A', share: 70, roi: 0 },
    { name: 'B', share: 50, roi: 0 },
  ]);
  close(r.shareSum, 120);
  close(r.unallocated, -200);
});

test('zero budget or no categories gives 0% ROI', () => {
  assert.equal(calculate(0, [{ name: 'A', share: 100, roi: 50 }]).totalRoi, 0);
  assert.equal(calculate(1000, []).totalRoi, 0);
});

test('toNumber handles comma decimals and garbage', () => {
  assert.equal(toNumber('12,5'), 12.5);
  assert.equal(toNumber(''), 0);
  assert.equal(toNumber('abc'), 0);
});
