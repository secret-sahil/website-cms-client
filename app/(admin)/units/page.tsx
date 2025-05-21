"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllUnits } from "@/hooks/useUnits";

export default function Page() {
  const { data } = useGetAllUnits();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Units",
          href: "/units",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
