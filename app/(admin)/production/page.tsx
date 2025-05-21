"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllProduction } from "@/hooks/useProduction";

export default function Page() {
  const { data } = useGetAllProduction();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Production",
          href: "/production",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
