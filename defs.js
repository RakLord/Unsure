// defs.js
export const LAYERS = [
  {
    id: 'L1',
    name: 'Layer 1',
    currencies: ['cash'],
    providers: [
      { id: 'p1', name: 'Printer', currency: 'cash', baseReward: 1, basePeriodMs: 2000 },
    ],
    upgrades: [
      { id: 'u_speed', name: 'Speed',   cost: { base: 10, growth: 1.15 }, effect: { stat: 'speedMul', addMul: 0.10 } },
      { id: 'u_reward', name: 'Reward', cost: { base: 10, growth: 1.15 }, effect: { stat: 'rewardMul', addMul: 0.10 } },
      { id: 'u_crit',   name: 'Crit %', cost: { base: 25, growth: 1.20 }, effect: { stat: 'critChance', add: 0.01 } },
      { id: 'u_critd',  name: 'Crit x', cost: { base: 50, growth: 1.25 }, effect: { stat: 'critMult', add: 0.10 } },
    ],
  },
  // L2, L3 ...
];
