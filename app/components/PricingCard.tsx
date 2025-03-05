"use client";

import React from "react";
import { PricingInterval, Tier } from "../lib/types/Tier";

interface PricingCardProps {
  tier: Tier;
  isPopular?: boolean;
  interval: PricingInterval;
}

export function PricingCard({
  tier,
  isPopular = false,
  interval,
}: PricingCardProps) {
  // Format price as dollars
  const formatPrice = (cents: number) => {
    const dollars = cents / 100;
    return dollars === 0 ? "Free" : `$${dollars.toFixed(0)}`;
  };

  // Format percentage
  const formatPercentage = (decimal: number) => {
    return `${(decimal * 100).toFixed(0)}%`;
  };

  const price =
    interval === PricingInterval.MONTHLY
      ? tier.pricePerMonth
      : tier.pricePerMonth * 10;

  const pricePerAdditionalCollective = tier.pricePerAdditionalCollective;

  const pricePerAdditionalExpense = tier.pricePerAdditionalExpense;

  return (
    <div
      className={`flex flex-col rounded-2xl p-6 shadow-lg ${
        isPopular
          ? "border-2 border-indigo-500 bg-white"
          : "bg-white/5 backdrop-blur-sm border border-gray-200"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 transform">
          <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
            Popular
          </span>
        </div>
      )}

      <div className="relative">
        <h3 className="text-xl font-semibold text-gray-900">{tier.title}</h3>
        <div className="mt-2 flex items-baseline gap-x-1">
          <span className="text-4xl font-bold tracking-tight text-gray-900">
            {formatPrice(price)}
          </span>
          <span className="text-sm font-semibold text-gray-600">
            /{interval === PricingInterval.MONTHLY ? "month" : "year"}
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Everything you need to manage your collective
          {tier.includedCollectives > 1 ? "s" : ""}.
        </p>
      </div>

      <ul className="mt-6 flex-1 space-y-4">
        <li className="flex items-start gap-x-2">
          <svg
            className="h-5 w-5 flex-none text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-700">
            <strong>{tier.includedCollectives}</strong>{" "}
            {tier.includedCollectives === 1 ? "collective" : "collectives"}{" "}
            included
          </span>
        </li>
        <li className="flex items-start gap-x-2">
          <svg
            className="h-5 w-5 flex-none text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-700">
            <strong>{tier.includedExpensesPerMonth}</strong> expenses per{" "}
            {interval === PricingInterval.MONTHLY ? "month" : "year"}
          </span>
        </li>
        <li className="flex items-start gap-x-2">
          <svg
            className="h-5 w-5 flex-none text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-700">
            <strong>${pricePerAdditionalCollective / 100}</strong> per
            additional collective
          </span>
        </li>
        <li className="flex items-start gap-x-2">
          <svg
            className="h-5 w-5 flex-none text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-700">
            <strong>${pricePerAdditionalExpense / 100}</strong> per additional
            expense
          </span>
        </li>
        <li className="flex items-start gap-x-2">
          <svg
            className="h-5 w-5 flex-none text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-700">
            <strong>{formatPercentage(tier.crowdfundingFee)}</strong>{" "}
            crowdfunding fee
          </span>
        </li>
      </ul>

      <a
        href="#"
        className={`mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isPopular
            ? "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
        }`}
      >
        Get started today
      </a>
    </div>
  );
}
