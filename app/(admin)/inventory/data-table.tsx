"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import { FilterIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@radix-ui/react-accordion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/data-table-pagination";
import ColumnDropdown from "@/components/column-view-handler";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<any>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div>
      <div className="flex items-center pb-2 justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={table.getState().globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            className="w-[20rem]"
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <FilterIcon size={16} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <Separator />
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Division</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {Array.from(
                        table.getColumn("division")?.getFacetedUniqueValues().keys() ?? []
                      ).map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={value}
                            onCheckedChange={(e) =>
                              table.getColumn("division")?.setFilterValue(e ? value : undefined)
                            }
                          />
                          <label htmlFor={value}>{value}</label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Item Type</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {Array.from(
                        table.getColumn("type")?.getFacetedUniqueValues().keys() ?? []
                      ).map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={value}
                            onCheckedChange={(e) =>
                              table.getColumn("type")?.setFilterValue(e ? value : undefined)
                            }
                          />
                          <label htmlFor={value}>{value}</label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          {globalFilter.length > 0 && (
            <Button onClick={() => setGlobalFilter([])} variant="outline" className="ml-auto">
              Clear
            </Button>
          )}
        </div>
        <div className="space-x-2">
          <ColumnDropdown table={table} storageKey={"item"} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => {
                return (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell: any) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="my-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
