"use server";

import { fetchData } from "@/lib/data";
import { FinancialOutcome } from "./FinancialOutcome";
import { newTiers } from "@/lib/tiers";

async function calculateProjectedRevenue() {
  const collectives = await fetchData();
  console.log("first", collectives[0]);

  return { fees: 0, platformTips: 0, tierSummary: [] };
}

export default async function FinancialOutcomeWrapper() {
  const projectedRevenue = await calculateProjectedRevenue();
  return <FinancialOutcome projectedRevenue={projectedRevenue} />;
}
