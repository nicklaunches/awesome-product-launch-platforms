"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "~/components/data-table/data-table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export interface LaunchLink {
  name: string;
  icon: string;
  description: string;
  href: string;
  tag: string;
  da: number;
  visits: number;
}

const columns: ColumnDef<LaunchLink>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const item = row.original;
      const domainUrl = toDomainUrl(item.href);
      return (
        <a
          className="inline-flex items-center gap-2 text-sm font-medium text-[#171717] underline-offset-4 hover:underline"
          href={domainUrl}
          rel="noreferrer"
          target="_blank"
        >
          {item.icon ? (
            <img
              alt={`${item.name} icon`}
              className="size-4 rounded-sm object-cover"
              loading="lazy"
              src={item.icon}
            />
          ) : null}
          <span>{item.name}</span>
        </a>
      );
    },
  },
  {
    accessorKey: "tag",
    header: "Type",
    filterFn: "equalsString",
    cell: ({ getValue }) => (
      <span className="inline-flex rounded-full bg-[#ebf5ff] px-2.5 py-0.5 text-xs font-medium text-[#0068d6]">
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "da",
    header: "DA",
    cell: ({ getValue }) => (
      <span className="text-sm text-[#4d4d4d]">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "visits",
    header: "Visits",
    cell: ({ getValue }) => {
      const visits = Number(getValue());
      return (
        <span className="text-sm text-[#4d4d4d]">
          {Number.isFinite(visits) ? visits.toLocaleString("en-US") : "-"}
        </span>
      );
    },
  },
];

interface LaunchLinksDataTableProps {
  data: LaunchLink[];
}

function toDomainUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    return `${url.origin}/`;
  } catch {
    return rawUrl;
  }
}

export function LaunchLinksDataTable({ data }: LaunchLinksDataTableProps) {
  const typeOptions = Array.from(
    new Set(data.map((item) => item.tag).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const nameColumn = table.getColumn("name");
  const typeColumn = table.getColumn("tag");
  const nameFilterValue = (nameColumn?.getFilterValue() as string) ?? "";
  const typeFilterValue = (typeColumn?.getFilterValue() as string) ?? "all";

  return (
    <DataTable
      className="[&>div]:border-0 [&>div]:rounded-none **:data-[slot=table-container]:max-h-[60vh] **:data-[slot=table-container]:overflow-auto [&_table]:min-w-230 [&_table]:text-left"
      showPagination={false}
      table={table}
    >
      <div className="flex flex-wrap items-center gap-2 p-1">
        <Input
          className="h-8 w-52"
          onChange={(event) => nameColumn?.setFilterValue(event.target.value)}
          placeholder="Search name..."
          value={nameFilterValue}
        />
        <Select
          onValueChange={(value) =>
            typeColumn?.setFilterValue(value === "all" ? undefined : value)
          }
          value={typeFilterValue || "all"}
        >
          <SelectTrigger className="h-8 w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {typeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="h-8"
          onClick={() => table.resetColumnFilters()}
          size="sm"
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </DataTable>
  );
}
