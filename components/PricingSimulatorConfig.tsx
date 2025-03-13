import React from "react";
import { cn } from "../lib/utils";
import { usePlanContext } from "../app/(landing)/layout";
import type { TierSet } from "../app/(landing)/layout";

export default function PricingSimulatorConfig() {
  const { tierSet, setTierSet } = usePlanContext();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          "w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
        )}
      >
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="tier-set" className="text-sm font-medium">
                Configuration
              </label>
              <span className="text-xs text-gray-500">Developer Options</span>
            </div>
            <select
              id="tier-set"
              value={tierSet}
              onChange={(e) => setTierSet(e.target.value as TierSet)}
              className="w-full rounded-md border border-gray-200 p-2 text-sm"
            >
              <option value="default">Default (9 tiers)</option>
              <option value="alt-display">
                Alternative display (3 tier levels)
              </option>
              <option value="alt-model">Alternative model (3 tiers)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
