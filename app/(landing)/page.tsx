"use client";

import { PlanFinder } from "../../components/PlanFinder";
import { usePlanContext } from "./layout";

/**
 * Page component for the landing page that contains just the plan finder sliders
 * It uses the PlanContext to connect with the layout
 */
export default function LandingPage() {
  const { expenses, setExpenses, collectives, setCollectives } =
    usePlanContext();

  return (
    <PlanFinder
      expenses={expenses}
      setExpenses={setExpenses}
      collectives={collectives}
      setCollectives={setCollectives}
    />
  );
}
