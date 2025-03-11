"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  PaginationState,
  flexRender,
} from "@tanstack/react-table";
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
  data: Host[];
}

export function CollectivesTable({ data }: CollectivesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
      const { tier, yearlyCost } = calculateBestTier(collective);
      totalIncome += yearlyCost;

      // Count by tier title
      tierCounts[tier.title]++;
      tierContributions[tier.title] += yearlyCost;
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
        id: "expensesPastMonth",
        header: "Expenses (Past Month)",
        accessorFn: (row) => {
          // Get the most recent month's data
          const latestMonth = row.monthlyExpenses?.length
            ? row.monthlyExpenses[row.monthlyExpenses.length - 1]
            : null;
          return latestMonth?.count || 0;
        },
        cell: (info) => (info.getValue() as number).toString(),
        size: 180, // Fixed width in pixels
      },
      {
        id: "expensesPastYear",
        header: "Expenses (Past Year)",
        accessorFn: (row) => {
          const totalExpenses =
            row.monthlyExpenses?.reduce((sum, month) => sum + month.count, 0) ||
            0;
          return totalExpenses;
        },
        cell: (info) => (info.getValue() as number).toString(),
        size: 180, // Fixed width in pixels
      },
      {
        id: "hostedCollectives",
        header: "Hosted Collectives",
        accessorFn: (row) => {
          // Get the most recent month's data for active collectives
          const latestMonth = row.monthlyActiveCollectives?.length
            ? row.monthlyActiveCollectives[
                row.monthlyActiveCollectives.length - 1
              ]
            : null;
          return latestMonth?.count || 0;
        },
        cell: (info) => (info.getValue() as number).toString(),
        size: 180, // Fixed width in pixels
      },
      {
        accessorKey: "totalRaisedCrowdfundingUSD",
        header: "Total crowdfunding (Past Year)",
        cell: (info) => {
          const value = info.getValue() as number;
          return formatCurrency(value);
        },
        size: 180, // Fixed width in pixels
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
        id: "yearlyCost",
        header: "Yearly Cost",
        accessorFn: (row) => {
          const { yearlyCost } = calculateBestTier(row);
          return yearlyCost;
        },
        cell: (info) => {
          const yearlyCost = info.getValue() as number;
          return formatCurrency(yearlyCost);
        },
        size: 180, // Fixed width in pixels
      },
    ],
    []
  );

  // Create table instance with pagination
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  return (
    <div className="w-full space-y-6 py-6">
      {/* Main Table Card */}
      <div className="py-6 ">
        <h2 className="text-xl font-semibold mb-4 px-6">Hosts</h2>
        <div className="overflow-x-auto border-t border-b">
          <Table className="w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50">
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
            <TableBody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden text-ellipsis"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 flex items-center justify-between mt-4 px-2">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <select
              className="border rounded px-2 py-1"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white px-6 rounded-lg">
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
                      Number of hosts
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
  );
}
