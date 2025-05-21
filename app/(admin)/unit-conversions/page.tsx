"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllUnitConversions } from "@/hooks/useUnitConversions";

export default function Page() {
  const { data } = useGetAllUnitConversions();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Unit Conversions",
          href: "/unit-conversions",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
