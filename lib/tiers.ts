import { AltTier, Tier, TierType } from "./types/Tier";

const features = {
  // Basic features (all tiers)
  ACCOUNT_MANAGEMENT: "Account management",
  SUBMIT_REVIEW_EXPENSES: "Submit and review expenses",
  MANUALLY_PAY_EXPENSES: "Manually pay expenses",
  UPDATES: "Updates",
  VENDORS: "Vendors",
  CROWDFUNDING: "Crowdfunding",

  // Paid tier features (Basic and Pro)
  PAY_WITH_WISE: "Pay with Wise",
  PAY_WITH_PAYPAL: "Pay with PayPal",
  ADVANCED_PERMISSIONS: "Advanced permissions",
  CHART_OF_ACCOUNTS: "Chart of accounts",
  HOSTED_COLLECTIVES: "Hosted collectives",
  ANTIFRAUD_SECURITY: "Antifraud security checks",
  EXPECTED_FUNDS: "Expected funds",
  CHARGE_HOSTING_FEES: "Charge hosting fees",
  RESTRICTED_FUNDS: "Restricted funds",

  // Pro tier features
  AGREEMENTS: "Agreements",
  TAX_FORMS: "Tax forms",
  CONNECT_BANK_ACCOUNTS: "Connect bank accounts",
  FUNDS_GRANTS_MANAGEMENT: "Funds & grants management",
};

const freeFeatures = [
  features.ACCOUNT_MANAGEMENT,
  features.SUBMIT_REVIEW_EXPENSES,
  features.MANUALLY_PAY_EXPENSES,
  features.UPDATES,
  features.VENDORS,
  features.CROWDFUNDING,
];

const basicFeatures = [
  ...freeFeatures,
  features.PAY_WITH_WISE,
  features.PAY_WITH_PAYPAL,
  features.ADVANCED_PERMISSIONS,
  features.CHART_OF_ACCOUNTS,
  features.HOSTED_COLLECTIVES,
  features.ANTIFRAUD_SECURITY,
  features.EXPECTED_FUNDS,
  features.CHARGE_HOSTING_FEES,
  features.RESTRICTED_FUNDS,
];

const proFeatures = [
  ...basicFeatures,
  features.AGREEMENTS,
  features.TAX_FORMS,
  features.CONNECT_BANK_ACCOUNTS,
  features.FUNDS_GRANTS_MANAGEMENT,
];

const featuresForTiers = {
  [TierType.FREE]: {
    // Map all features to booleans based on whether they are included in freeFeatures
    ...Object.fromEntries(
      Object.values(features).map((feature) => [
        feature,
        freeFeatures.includes(feature),
      ])
    ),
  },
  [TierType.BASIC]: {
    // Map all features to booleans based on whether they are included in basicFeatures
    ...Object.fromEntries(
      Object.values(features).map((feature) => [
        feature,
        basicFeatures.includes(feature),
      ])
    ),
  },
  [TierType.PRO]: {
    // Map all features to booleans based on whether they are included in proFeatures
    ...Object.fromEntries(
      Object.values(features).map((feature) => [
        feature,
        proFeatures.includes(feature),
      ])
    ),
  },
};

export { featuresForTiers, features };

export const altTiers: AltTier[] = [
  {
    type: TierType.FREE,
    altPricingModel: {
      basePricePerMonth: 0,
      includedExpensesPerMonth: 5,
      includedCollectives: 0,
      pricePerAdditionalExpense: 199,
      pricePerAdditionalCollective: 999,
    },
    packages: [
      {
        title: "",
        pricePerMonth: 0,
        includedCollectives: 1,
        pricePerAdditionalCollective: 1999, // $19.99
        includedExpensesPerMonth: 5,
        pricePerAdditionalExpense: 299, // $2.99
      },
    ],
  },
  {
    type: TierType.BASIC,
    altPricingModel: {
      basePricePerMonth: 4900,
      includedExpensesPerMonth: 5,
      includedCollectives: 0,
      pricePerAdditionalExpense: 299,
      pricePerAdditionalCollective: 1099,
    },
    packages: [
      {
        title: "S",
        pricePerMonth: 4900, // $49.00
        includedCollectives: 5,
        pricePerAdditionalCollective: 1999, // $19.99
        includedExpensesPerMonth: 25,
        pricePerAdditionalExpense: 299, // $2.99
      },
      {
        title: "M",
        pricePerMonth: 9900, // $99.00
        includedCollectives: 10,
        pricePerAdditionalCollective: 1899, // $18.99
        includedExpensesPerMonth: 50,
        pricePerAdditionalExpense: 289, // $2.89
      },
      {
        title: "L",
        pricePerMonth: 29900, // $299.00
        includedCollectives: 25,
        pricePerAdditionalCollective: 1799, // $17.99
        includedExpensesPerMonth: 100,
        pricePerAdditionalExpense: 279, // $2.79
      },
      {
        title: "XL",
        pricePerMonth: 49900, // $499.00
        includedCollectives: 50,
        pricePerAdditionalCollective: 1699, // $16.99
        includedExpensesPerMonth: 150,
        pricePerAdditionalExpense: 269, // $2.69
      },
    ],
  },
  {
    type: TierType.PRO,
    altPricingModel: {
      basePricePerMonth: 9900,
      includedExpensesPerMonth: 5,
      includedCollectives: 0,
      pricePerAdditionalExpense: 349,
      pricePerAdditionalCollective: 1199,
    },
    packages: [
      {
        title: "S",
        pricePerMonth: 99900, // $999.00
        includedCollectives: 100,
        pricePerAdditionalCollective: 1299, // $12.99
        includedExpensesPerMonth: 500,
        pricePerAdditionalExpense: 199, // $1.99
      },
      {
        title: "M",
        pricePerMonth: 249900, // $2499.00
        includedCollectives: 250,
        pricePerAdditionalCollective: 1199, // $11.99
        includedExpensesPerMonth: 2000,
        pricePerAdditionalExpense: 149, // $1.49
      },
      {
        title: "L",
        pricePerMonth: 499900, // $4999.00
        includedCollectives: 500,
        pricePerAdditionalCollective: 999, // $9.99
        includedExpensesPerMonth: 5000,
        pricePerAdditionalExpense: 99, // $0.99
      },
      {
        title: "XL",
        pricePerMonth: 1999900, // $19999.00
        includedCollectives: 2500,
        pricePerAdditionalCollective: 999, // $9.99
        includedExpensesPerMonth: 25000,
        pricePerAdditionalExpense: 99, // $0.99
      },
    ],
  },
];

export const defaultTiers: Tier[] = [
  {
    type: TierType.FREE,
    title: "Starter",
    pricePerMonth: 0,
    includedCollectives: 1,
    pricePerAdditionalCollective: 1999, // $19.99
    includedExpensesPerMonth: 5,
    pricePerAdditionalExpense: 299, // $2.99
    crowdfundingFee: 0,
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
    pricePerMonth: 1999900, // $19999.00
    includedCollectives: 2500,
    pricePerAdditionalCollective: 999, // $9.99
    includedExpensesPerMonth: 25000,
    pricePerAdditionalExpense: 99, // $0.99
    crowdfundingFee: 0,
  },
];
