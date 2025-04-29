import { NewTier, TierType } from "./types/Tier";

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

const featuresForStarter = Object.fromEntries(
  Object.values(features).map((feature) => [
    feature,
    freeFeatures.includes(feature),
  ])
);

const featuresForBasic = Object.fromEntries(
  Object.values(features).map((feature) => [
    feature,
    basicFeatures.includes(feature),
  ])
);

const featuresForPro = Object.fromEntries(
  Object.values(features).map((feature) => [
    feature,
    proFeatures.includes(feature),
  ])
);

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

export const newTiers: NewTier[] = [
  {
    set: "default",
    title: "Starter",
    type: TierType.FREE,
    pricingModel: {
      pricePerMonth: 0,
      includedCollectives: 1,
      pricePerAdditionalCollective: 1999, // $19.99
      includedExpensesPerMonth: 5,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForStarter,
  },
  {
    set: "default",
    title: "Basic S",
    type: TierType.BASIC,
    pricingModel: {
      pricePerMonth: 4900, // $49.00
      includedCollectives: 3,
      pricePerAdditionalCollective: 1999, // $19.99
      includedExpensesPerMonth: 25,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForBasic,
  },
  {
    set: "default",
    title: "Basic M",
    type: TierType.BASIC,
    pricingModel: {
      pricePerMonth: 9900, // $99.00
      includedCollectives: 5,
      pricePerAdditionalCollective: 1999, // $19.99
      includedExpensesPerMonth: 50,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForBasic,
  },
  {
    set: "default",
    title: "Basic L",
    type: TierType.BASIC,
    pricingModel: {
      pricePerMonth: 19900, // $199.00
      includedCollectives: 10,
      pricePerAdditionalCollective: 1999, // 19.99
      includedExpensesPerMonth: 100,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForBasic,
  },
  {
    set: "default",
    title: "Basic XL",
    type: TierType.BASIC,
    pricingModel: {
      pricePerMonth: 49900, // $499.00
      includedCollectives: 25,
      pricePerAdditionalCollective: 1999, // 19.99
      includedExpensesPerMonth: 250,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForBasic,
  },
  {
    set: "default",
    title: "Pro S",
    type: TierType.PRO,
    pricingModel: {
      pricePerMonth: 99900, // $999.00
      includedCollectives: 50,
      pricePerAdditionalCollective: 1999, // 19.99
      includedExpensesPerMonth: 500,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForPro,
  },
  {
    set: "default",
    title: "Pro M",
    type: TierType.PRO,
    pricingModel: {
      pricePerMonth: 199900, // $1999.00
      includedCollectives: 100,
      pricePerAdditionalCollective: 1999, // 19.99
      includedExpensesPerMonth: 1000,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForPro,
  },
  {
    set: "default",
    title: "Pro L",
    type: TierType.PRO,
    pricingModel: {
      pricePerMonth: 499900, // $4999.00
      includedCollectives: 250,
      pricePerAdditionalCollective: 1999, // 19.99
      includedExpensesPerMonth: 2500,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForPro,
  },
  {
    set: "default",
    title: "Pro XL",
    type: TierType.PRO,
    pricingModel: {
      pricePerMonth: 1999900, // $19999.00
      includedCollectives: 1000,
      pricePerAdditionalCollective: 1999, // 19.99
      includedExpensesPerMonth: 10000,
      pricePerAdditionalExpense: 199, // $1.99
    },
    features: featuresForPro,
  },
  {
    set: "alt-model",
    title: "Starter",
    pricingModel: {
      pricePerMonth: 0,
      includedExpensesPerMonth: 5,
      includedCollectives: 0,
      pricePerAdditionalExpense: 199,
      pricePerAdditionalCollective: 999,
    },
    features: featuresForStarter,
    bgColor: "rgb(222, 234, 254)",
    fgColor: "rgb(28, 74, 144)",
  },
  {
    set: "alt-model",
    title: "Basic",
    pricingModel: {
      pricePerMonth: 4900,
      includedExpensesPerMonth: 5,
      includedCollectives: 0,
      pricePerAdditionalExpense: 299,
      pricePerAdditionalCollective: 1099,
    },
    features: featuresForBasic,
    bgColor: "rgb(223, 227, 222)",
    fgColor: "rgb(28, 79, 74)",
  },
  {
    set: "alt-model",
    title: "Pro",
    pricingModel: {
      pricePerMonth: 9900,
      includedExpensesPerMonth: 5,
      includedCollectives: 0,
      pricePerAdditionalExpense: 349,
      pricePerAdditionalCollective: 1199,
    },
    features: featuresForPro,
    bgColor: "rgb(251, 235, 214)",
    fgColor: "rgb(252, 103, 25)",
  },
];
