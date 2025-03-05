/**
 * Enum for tier types
 */
export enum TierType {
  FREE = "Free",
  BASIC = "Basic",
  PRO = "Pro",
}

/**
 * Interface representing a pricing interval
 */
export enum PricingInterval {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

/**
 * Interface representing a pricing tier
 */
export interface Tier {
  /** The type of tier (Free, Basic, Pro) */
  type: TierType;

  /** The display title of the tier */
  title: string;

  /** The monthly price in the smallest currency unit (e.g., cents) */
  pricePerMonth: number;

  /** Number of collectives included in this tier */
  includedCollectives: number;

  /** Price for each additional collective beyond the included amount (monthly) */
  pricePerAdditionalCollective: number;

  /** Number of expenses included in this tier */
  includedExpensesPerMonth: number;

  /** Price for each additional expense beyond the included amount (monthly) */
  pricePerAdditionalExpense: number;

  /** Crowdfunding fee as a decimal (e.g., 0.05 for 5%) */
  crowdfundingFee: number;
}
