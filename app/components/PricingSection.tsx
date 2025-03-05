"use client";

import React, { useState } from "react";
import { tiers } from "../lib/tiers";
import { PricingInterval, TierType } from "../lib/types/Tier";
import { PricingCard } from "./PricingCard";
import Link from "next/link";

export function PricingSection() {
  const [interval, setInterval] = useState<PricingInterval>(
    PricingInterval.MONTHLY
  );

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing Simulator
          </h1>
          <p className="mt-2 text-4xl font-bold text-balance tracking-tight text-gray-900 sm:text-5xl">
            Help Us Shape Our New Pricing Model
          </p>
          <p className="mt-6 text-balance text-lg leading-8 text-gray-600">
            We&apos;re exploring a new business model to ensure long-term
            sustainability. Your feedback on these potential pricing options is
            invaluable as we work together to create a fair and transparent
            funding approach.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="relative flex items-center rounded-full p-1 bg-gray-100">
            <button
              type="button"
              className={`${
                interval === PricingInterval.MONTHLY
                  ? "bg-white shadow-md"
                  : "text-gray-500"
              } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none transition-all duration-200 ease-in-out`}
              onClick={() => setInterval(PricingInterval.MONTHLY)}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`${
                interval === PricingInterval.YEARLY
                  ? "bg-white shadow-md"
                  : "text-gray-500"
              } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none transition-all duration-200 ease-in-out`}
              onClick={() => setInterval(PricingInterval.YEARLY)}
            >
              Yearly{" "}
              <span className="text-indigo-600 font-medium">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers
            .filter((t) => t.type !== TierType.PRO)
            .map((tier) => (
              <div key={tier.title} className="relative">
                <PricingCard tier={tier} interval={interval} />
              </div>
            ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm leading-6 text-gray-500">
            Prices in USD. These are proposed models for feedback only. Please{" "}
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              share your thoughts with us
            </a>
            .
          </p>

          <div className="mt-4">
            <Link
              href="/list"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Data
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
