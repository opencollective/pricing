"use client";

import React, { ReactNode } from "react";

interface PricingFeatureCellProps {
  value: string | number | ReactNode;
  onHoverKey: string;
  isPopular?: boolean;
  isHovered?: boolean;
  onHover: (tierId: string | null) => void;
}

export function PricingFeatureCell({
  value,
  isHovered = false,
  onHover,
  onHoverKey,
}: PricingFeatureCellProps) {
  // Styles for highlighting the popular column
  // const textColor = isPopular ? "text-indigo-600" : "text-gray-700";

  return (
    <td
      className={`px-6 py-4 text-sm text-center font-medium text-gray-700 transition-colors ${
        isHovered ? "bg-gray-50" : ""
      } `}
      onMouseEnter={() => onHover(onHoverKey)}
      onMouseLeave={() => onHover(null)}
    >
      {value}
    </td>
  );
}
