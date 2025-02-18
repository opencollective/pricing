const fs = require('fs');

const { parse } = require('csv-parse/sync');

const sum = array => array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

const round = float => Number(float.toFixed(2));

const metricsFilename = './metrics.csv';

const metricsInput = fs.readFileSync(metricsFilename, 'utf8');

const metricsData = parse(metricsInput, {
  columns: true,
  skip_empty_lines: true,
}).map(({ id, Collectives, Expenses, CrowdfundingUSD }) => ({
  id: Number(id),
  Collectives: Number(Collectives),
  Expenses: Number(Expenses),
  CrowdfundingUSD: String(CrowdfundingUSD).length ? Number(String(CrowdfundingUSD).replace(/[$,]/g, '')) : 0,
}));

const plans = {
  base: { basePrice: 0, collectives: 1, expenses: 5, perCollective: 19.99, perExpense: 2.99 },
  s: { basePrice: 49.99, collectives: 5, expenses: 25, perCollective: 18.99, perExpense: 2.89 },
  m: { basePrice: 99.99, collectives: 10, expenses: 50, perCollective: 17.99, perExpense: 2.79 },
  l: { basePrice: 299.99, collectives: 25, expenses: 100, perCollective: 16.99, perExpense: 2.69 },
  xl: { basePrice: 499.99, collectives: 50, expenses: 200, perCollective: 15.99, perExpense: 2.59 },
  pro_s: { basePrice: 999.99, collectives: 100, expenses: 500, perCollective: 14.99, perExpense: 2.49 },
  pro_m: { basePrice: 2499.99, collectives: 250, expenses: 2000, perCollective: 13.99, perExpense: 2.39 },
  pro_l: { basePrice: 4999.99, collectives: 500, expenses: 5000, perCollective: 12.99, perExpense: 2.29 },
  pro_xl: { basePrice: 19999.99, collectives: 2500, expenses: 25000, perCollective: 11.99, perExpense: 2.19 },
};

const calculatePlan = (metricsEntry, planData) => {
  let price = planData.basePrice;
  if (metricsEntry.Collectives > planData.collectives) {
    price += (metricsEntry.Collectives - planData.collectives) * planData.perCollective;
  }
  if (Math.ceil(metricsEntry.Expenses / 12) > planData.expenses) {
    price += (Math.ceil(metricsEntry.Expenses / 12) - planData.expenses) * planData.perExpense;
  }

  return Number(price.toFixed(2));
};

const augmentedMetrics = metricsData.map(metricsEntry => {
  const computedPricing = Object.fromEntries(
    Object.keys(plans).map(plan => [plan, calculatePlan(metricsEntry, plans[plan])]),
  );
  const bestPricing = Math.min(...Object.values(computedPricing));
  const bestPlan = Object.keys(computedPricing).find(key => computedPricing[key] === bestPricing);
  return {
    ...metricsEntry,
    pricing: computedPricing,
    bestPlan,
    bestPricing,
    totalPricing: Number((bestPricing + (5 * (metricsEntry.CrowdfundingUSD / 12)) / 100).toFixed(2)),
  };
});

console.log('Top 10 Customers', augmentedMetrics.sort((a, b) => b.bestPricing - a.bestPricing).slice(0, 10));

console.log('Total Revenue', round(sum(augmentedMetrics.map(m => m.totalPricing))));
