import {
  type Column,
  flexRender,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import type * as React from "react";

import { DataTablePagination } from "~/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

function getColumnPinningStyle<TData>({
  column,
}: {
  column: Column<TData>;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  showPagination?: boolean;
}

export function DataTable<TData>({
  table,
  actionBar,
  showPagination = true,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    colSpan={header.colSpan}
                    key={header.id}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={table.getAllColumns().length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination ? (
        <div className="flex flex-col gap-2.5">
          <DataTablePagination table={table} />
          {actionBar &&
            table.getFilteredSelectedRowModel().rows.length > 0 &&
            actionBar}
        </div>
      ) : null}
    </div>
  );
}
