"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { usePricingContext } from "@/app/providers/PricingProvider";

export function PlanFinder() {
  const { expenses, collectives, setExpenses, setCollectives } =
    usePricingContext();

  // Define breakpoints with increasing increments
  const createScaleBreakpoints = () => {
    const breakpoints: number[] = [];

    // 0-100: increment by 1
    for (let i = 0; i <= 100; i += 1) breakpoints.push(i);

    // 100-200: increment by 10
    for (let i = 110; i <= 200; i += 10) breakpoints.push(i);

    // 200-500: increment by 25
    for (let i = 225; i <= 500; i += 25) breakpoints.push(i);

    // 500-1000: increment by 50
    for (let i = 550; i <= 1000; i += 50) breakpoints.push(i);

    // 1000-2000: increment by 100
    for (let i = 1100; i <= 2000; i += 100) breakpoints.push(i);

    return breakpoints;
  };

  const breakpoints = createScaleBreakpoints();

  // Convert value to slider position (0-100 scale)
  const valueToSlider = (value: number) => {
    if (value === 0) return 0;

    // Find the closest breakpoint
    let closestIndex = 0;
    let minDiff = Math.abs(breakpoints[0] - value);

    for (let i = 1; i < breakpoints.length; i++) {
      const diff = Math.abs(breakpoints[i] - value);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    // Map to 0-100 scale
    return (closestIndex / (breakpoints.length - 1)) * 100;
  };

  // Convert slider position to actual value
  const sliderToValue = (sliderPosition: number) => {
    if (sliderPosition === 0) return 0;

    // Map from 0-100 scale to breakpoint index
    const index = Math.round((sliderPosition / 100) * (breakpoints.length - 1));
    return breakpoints[Math.min(index, breakpoints.length - 1)];
  };

  return (
    <div className="">
      <div className="space-y-8">
        <div>
          <div className="mb-2">
            <label htmlFor="expenses-slider" className="font-medium">
              How many expenses per month will you pay?
            </label>
          </div>
          <div className="relative pt-2 pb-2">
            <Slider
              id="expenses-slider"
              value={[valueToSlider(expenses)]}
              min={0}
              max={100}
              step={0.1}
              onValueChange={(values) => setExpenses(sliderToValue(values[0]))}
              className="w-full"
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {expenses} expenses per month
          </div>
        </div>

        <div>
          <div className="mb-2">
            <label htmlFor="collectives-slider" className="font-medium">
              Will you host other collectives?
            </label>
          </div>
          <div className="relative pt-2 pb-2">
            <Slider
              id="collectives-slider"
              value={[valueToSlider(collectives)]}
              min={0}
              max={100}
              step={0.1}
              onValueChange={(values) => setCollectives(sliderToValue(values[0]))}
              className="w-full"
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {collectives} hosted collectives
          </div>
        </div>
      </div>
    </div>
  );
}
