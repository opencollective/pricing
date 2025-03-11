"use client";

import React, { ReactNode } from "react";
import { Tier } from "../lib/types/Tier";

interface PricingFeatureCellProps {
  value: string | number | ReactNode;
  tier: Tier;
  isPopular?: boolean;
  isHovered?: boolean;
  onHover: (tierId: string | null) => void;
}

export function PricingFeatureCell({
  value,
  isPopular,
  isHovered = false,
  onHover,
  tier,
}: PricingFeatureCellProps) {
  // Styles for highlighting the popular column
  // const textColor = isPopular ? "text-indigo-600" : "text-gray-700";

  return (
    <td
      className={`px-6 py-4 text-sm text-center font-medium text-gray-700 transition-colors ${
        isHovered ? "bg-gray-50" : ""
      } `}
      onMouseEnter={() => onHover(tier.title)}
      onMouseLeave={() => onHover(null)}
    >
      {value}
    </td>
  );
}
