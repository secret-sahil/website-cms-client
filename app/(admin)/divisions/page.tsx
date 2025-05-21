"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllDivisions } from "@/hooks/useDivisions";

export default function Page() {
  const { data } = useGetAllDivisions();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Divisions",
          href: "/divisions",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
