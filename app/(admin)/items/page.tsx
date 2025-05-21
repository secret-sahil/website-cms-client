"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllItems } from "@/hooks/useItems";

export default function Page() {
  const { data } = useGetAllItems();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Items",
          href: "/items",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
