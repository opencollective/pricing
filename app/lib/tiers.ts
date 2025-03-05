import { Tier, TierType } from "./types/Tier";

export const tiers: Tier[] = [
  {
    type: TierType.FREE,
    title: "Free",
    pricePerMonth: 0,
    includedCollectives: 1,
    pricePerAdditionalCollective: 3000, // $30.00
    includedExpensesPerMonth: 100,
    pricePerAdditionalExpense: 50, // $0.50
    crowdfundingFee: 0.05,
  },
  {
    type: TierType.BASIC,
    title: "Basic S",
    pricePerMonth: 4900, // $49.00
    includedCollectives: 5,
    pricePerAdditionalCollective: 1999, // $19.99
    includedExpensesPerMonth: 25,
    pricePerAdditionalExpense: 299, // $2.99
    crowdfundingFee: 0,
  },
  {
    type: TierType.BASIC,
    title: "Basic M",
    pricePerMonth: 9900, // $99.00
    includedCollectives: 10,
    pricePerAdditionalCollective: 1899, // $18.99
    includedExpensesPerMonth: 50,
    pricePerAdditionalExpense: 289, // $2.89
    crowdfundingFee: 0,
  },
  {
    type: TierType.BASIC,
    title: "Basic L",
    pricePerMonth: 29900, // $299.00
    includedCollectives: 25,
    pricePerAdditionalCollective: 1799, // $17.99
    includedExpensesPerMonth: 100,
    pricePerAdditionalExpense: 279, // $2.79
    crowdfundingFee: 0,
  },
  {
    type: TierType.BASIC,
    title: "Basic XL",
    pricePerMonth: 49900, // $499.00
    includedCollectives: 50,
    pricePerAdditionalCollective: 1699, // $16.99
    includedExpensesPerMonth: 150,
    pricePerAdditionalExpense: 269, // $2.69
    crowdfundingFee: 0,
  },
  {
    type: TierType.PRO,
    title: "Pro S",
    pricePerMonth: 99900, // $999.00
    includedCollectives: 100,
    pricePerAdditionalCollective: 1299, // $12.99
    includedExpensesPerMonth: 500,
    pricePerAdditionalExpense: 199, // $1.99
    crowdfundingFee: 0,
  },
  {
    type: TierType.PRO,
    title: "Pro M",
    pricePerMonth: 249900, // $2499.00
    includedCollectives: 250,
    pricePerAdditionalCollective: 1199, // $11.99
    includedExpensesPerMonth: 2000,
    pricePerAdditionalExpense: 149, // $1.49
    crowdfundingFee: 0,
  },
  {
    type: TierType.PRO,
    title: "Pro L",
    pricePerMonth: 499900, // $4999.00
    includedCollectives: 500,
    pricePerAdditionalCollective: 999, // $9.99
    includedExpensesPerMonth: 5000,
    pricePerAdditionalExpense: 99, // $0.99
    crowdfundingFee: 0,
  },
  {
    type: TierType.PRO,
    title: "Pro XL",
    pricePerMonth: 199900, // $1999.00
    includedCollectives: 2500,
    pricePerAdditionalCollective: 999, // $9.99
    includedExpensesPerMonth: 25000,
    pricePerAdditionalExpense: 99, // $0.99
    crowdfundingFee: 0,
  },
];
