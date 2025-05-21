import { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Define props type
interface ColumnDropdownProps<TData> {
  table: Table<TData>;
  storageKey: string;
}

function ColumnDropdown<TData>({ table, storageKey }: ColumnDropdownProps<TData>) {
  // Unique storage key for each table
  const COLUMN_STORAGE_KEY = `table_columns_${storageKey}`;

  // State to track column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Load saved column visibility on mount
  useEffect(() => {
    const savedVisibility = JSON.parse(localStorage.getItem(COLUMN_STORAGE_KEY) || "{}");

    table.getAllColumns().forEach((column) => {
      if (column.getCanHide()) {
        column.toggleVisibility(savedVisibility[column.id] ?? true);
      }
    });

    setColumnVisibility(savedVisibility);
  }, [COLUMN_STORAGE_KEY, table]);

  // Handle column toggle and save to localStorage
  const handleToggle = (columnId: string, value: boolean) => {
    const column = table.getColumn(columnId);
    if (!column) return;

    column.toggleVisibility(value);

    const updatedVisibility = {
      ...columnVisibility,
      [columnId]: value,
    };

    setColumnVisibility(updatedVisibility);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updatedVisibility));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={columnVisibility[column.id] ?? column.getIsVisible()}
              onCheckedChange={(value) => handleToggle(column.id, !!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ColumnDropdown;
