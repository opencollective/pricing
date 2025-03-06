"use client";

import { useState, useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  calculateBestTier,
  formatCurrency,
} from "../lib/helpers/tierCalculation";
import { tiers } from "../lib/tiers";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Host } from "../lib/data";

interface CollectivesTableProps {
  data: Host[]; // Use the Collective type
}

export function CollectivesTable({ data }: CollectivesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Container references for virtualization
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Calculate summary statistics
  const summary = useMemo(() => {
    let totalIncome = 0;

    // Initialize all tiers with zero counts and contributions
    const tierCounts: Record<string, number> = {};
    const tierContributions: Record<string, number> = {};

    // Pre-populate with all tiers to preserve order and include zero-count tiers
    tiers.forEach((tier) => {
      tierCounts[tier.title] = 0;
      tierContributions[tier.title] = 0;
    });

    data.forEach((collective) => {
      const { tier, monthlyCost } = calculateBestTier(collective);
      totalIncome += monthlyCost;

      // Count by tier title
      tierCounts[tier.title]++;
      tierContributions[tier.title] += monthlyCost;
    });

    return {
      totalIncome,
      tierCounts,
      tierContributions,
      currency: "$",
    };
  }, [data]);

  // Define table columns
  const columns = useMemo<ColumnDef<Host>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => {
          const row = info.row.original;
          return (
            <a
              href={`https://opencollective.com/${row.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {info.getValue() as string}
            </a>
          );
        },
        size: 200, // Fixed width in pixels
      },
      {
        accessorKey: "paidExpensesCount",
        header: "Total Expenses",
        cell: (info) => info.getValue() || "0",
        size: 150, // Fixed width in pixels
      },
      {
        accessorKey: "expensesPaidPastMonth",
        header: "Expenses (Past Month)",
        cell: (info) => info.getValue() || "0",
        size: 180, // Fixed width in pixels
      },
      {
        accessorKey: "expensesPaidPastYear",
        header: "Expenses (Past Year)",
        cell: (info) => info.getValue() || "0",
        size: 180, // Fixed width in pixels
      },
      {
        accessorKey: "numberOfCollectives",
        header: "Hosted Collectives",
        cell: (info) => info.getValue() || "0",
        size: 180, // Fixed width in pixels
      },
      {
        accessorKey: "totalCrowdfundingPastMonth",
        header: "Funding (Past Month)",
        cell: (info) => {
          const value = info.getValue() as number;
          const currency = info.row.original.currency;
          return formatCurrency(value, currency);
        },
        size: 180, // Fixed width in pixels
      },
      {
        accessorKey: "totalCrowdfundingPastYear",
        header: "Funding (Past Year)",
        cell: (info) => {
          const value = info.getValue() as number;
          const currency = info.row.original.currency;
          return formatCurrency(value, currency);
        },
        size: 180, // Fixed width in pixels
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString();
        },
        size: 150, // Fixed width in pixels
      },
      {
        id: "bestTier",
        header: "Recommended Tier",
        accessorFn: (row) => {
          const { tier } = calculateBestTier(row);
          return tier.title;
        },
        cell: (info) => info.getValue(),
        size: 180, // Fixed width in pixels
      },
      {
        id: "monthlyCost",
        header: "Monthly Cost",
        accessorFn: (row) => {
          const { monthlyCost } = calculateBestTier(row);
          return monthlyCost;
        },
        cell: (info) => {
          const monthlyCost = info.getValue() as number;
          return formatCurrency(monthlyCost, info.row.original.currency);
        },
        size: 180, // Fixed width in pixels
      },
    ],
    []
  );

  // Create table instance - remove pagination model
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  // Set up virtualization
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 53, // Approximate height of each row in pixels
    overscan: 10, // Number of items to render outside of the visible area
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1].end || 0)
      : 0;

  return (
    <div className="w-full h-screen flex flex-col relative">
      {/* Table takes full height */}
      <div
        ref={tableContainerRef}
        className="overflow-auto h-screen flex-grow border rounded-lg"
      >
        <Table className="w-full divide-y divide-gray-200 border-collapse table-fixed">
          <TableHeader className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <span className="ml-1">↑</span>,
                        desc: <span className="ml-1">↓</span>,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200 relative">
            {paddingTop > 0 && (
              <TableRow>
                <TableCell
                  style={{ height: `${paddingTop}px` }}
                  colSpan={columns.length}
                />
              </TableRow>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden text-ellipsis"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            {paddingBottom > 0 && (
              <TableRow>
                <TableCell
                  style={{ height: `${paddingBottom}px` }}
                  colSpan={columns.length}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Floating Summary at bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[400px]">
              <div className="overflow-x-auto">
                <Table className="min-w-full divide-y divide-gray-200">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Tier
                      </TableHead>
                      <TableHead className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Collectives
                      </TableHead>
                      <TableHead className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Revenue
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-gray-100">
                    {tiers.map((tier) => (
                      <TableRow
                        key={tier.title}
                        className={
                          summary.tierCounts[tier.title] === 0
                            ? "text-gray-400"
                            : ""
                        }
                      >
                        <TableCell className="px-3 py-2 text-sm font-medium">
                          {tier.title}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-sm text-right">
                          {summary.tierCounts[tier.title]}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-sm text-right">
                          {formatCurrency(
                            summary.tierContributions[tier.title] || 0,
                            summary.currency
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="bg-gray-50">
                    <TableRow>
                      <TableCell className="px-3 py-2 text-sm font-medium">
                        Total
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm font-medium text-right">
                        {Object.values(summary.tierCounts).reduce(
                          (sum, count) => sum + count,
                          0
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm font-medium text-right">
                        {formatCurrency(summary.totalIncome, summary.currency)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
