import { Host } from "./data";

export function calculateMetrics(host: Host) {
  const hostFeesCrowdfundingUSD = Math.round(
    (host.totalRaisedCrowdfundingUSD * host.hostFeePercent) / 100
  );
  const hostFeesNonCrowdfundingUSD = Math.round(
    (host.totalRaisedNonCrowdfundingUSD * host.hostFeePercent) / 100
  );
  const totalHostFeesUSD = hostFeesCrowdfundingUSD + hostFeesNonCrowdfundingUSD;

  const platformTips = true;

  const fees = {
    before: {
      platformFeesOnCrowdfunding: platformTips
        ? 0
        : Math.round((hostFeesCrowdfundingUSD * 15) / 100),
      platformFeesOnNonCrowdfunding: Math.round(
        (hostFeesNonCrowdfundingUSD * 15) / 100
      ),
      basePrice: 0,
      extraCollectives: 0, // adjust for gift collective
      extraExpenses: 0,
    },
    after: {
      platformFeesOnCrowdfunding: 0, // adjust for OSC
      platformFeesOnNonCrowdfunding: 0, // adjust for OSC
      basePrice: 0, // calculate according to tier
      extraCollectives: 0, // calculate according to tier
      extraExpenses: 0, // calculate according to tier
    },
  };
  return {
    ...host,
    hostFeesCrowdfundingUSD,
    hostFeesNonCrowdfundingUSD,
    totalHostFeesUSD,
    fees: {
      before: {
        ...fees.before,
        total:
          fees.before.platformFeesOnCrowdfunding +
          fees.before.platformFeesOnNonCrowdfunding +
          fees.before.basePrice +
          fees.before.extraCollectives +
          fees.before.extraExpenses,
      },
      after: {
        ...fees.after,
        total:
          fees.after.platformFeesOnCrowdfunding +
          fees.after.platformFeesOnNonCrowdfunding +
          fees.after.basePrice +
          fees.after.extraCollectives +
          fees.after.extraExpenses,
      },
    },
  };
}

export function formatAmount(cents: number, decimals = 0) {
  const dollars = cents / 100;
  if (dollars === 0) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(dollars);
}
