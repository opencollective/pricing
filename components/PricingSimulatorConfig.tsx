import React from "react";
import { usePricingContext } from "@/app/providers/PricingProvider";
import type { TierSet } from "@/lib/types/Tier";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function PricingSimulatorConfig() {
  const { tierSet, setTierSet } = usePricingContext();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Open settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tier-set">Configuration</Label>
                <span className="text-xs text-muted-foreground">
                  Developer Options
                </span>
              </div>
              <Select
                value={tierSet}
                onValueChange={(value) => setTierSet(value as TierSet)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier set" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (9 tiers)</SelectItem>
                  <SelectItem value="alt-model">
                    Alternative model (3 tiers)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
