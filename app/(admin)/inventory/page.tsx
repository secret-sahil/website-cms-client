"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllInventory } from "@/hooks/useInventory";

export default function Page() {
  const { data } = useGetAllInventory();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Inventory",
          href: "/inventory",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
