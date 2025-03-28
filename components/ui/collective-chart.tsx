"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Host } from "@/lib/data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface CollectiveChartProps {
  collective: Host;
  title?: string;
  description?: string;
}

export function CollectiveChart({
  collective,
  title = "Monthly Activity",
  description = "Active collectives and expenses over the past year",
}: CollectiveChartProps) {
  // Combine monthlyActiveCollectives and monthlyExpenses
  const chartData = collective.monthlyActiveCollectives
    .map((item, index) => {
      const expenseData = collective.monthlyExpenses[index] || { count: 0 };
      return {
        month: item.month,
        activeCollectives: item.count,
        expenses: expenseData.count,
      };
    })
    // Sort data by month (newest first)
    .sort((a, b) => b.month.localeCompare(a.month))
    // Show only the most recent 12 months
    .slice(0, 12)
    // Reverse to show oldest first for the chart
    .reverse();

  // Define chart configuration for shadcn/ui chart
  const chartConfig = {
    activeCollectives: {
      label: "Active Collectives",
      color: "#8884d8",
    },
    expenses: {
      label: "Monthly Expenses",
      color: "#82ca9d",
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full max-w-full">
          <ChartContainer className="w-full h-full" config={chartConfig}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => {
                  const date = new Date(month);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  });
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(month) => {
                  const date = new Date(month);
                  return date.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  });
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="activeCollectives"
                stroke="var(--color-activeCollectives)"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="var(--color-expenses)"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
