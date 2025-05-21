"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllParties } from "@/hooks/useParties";

export default function Page() {
  const { data } = useGetAllParties();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Parties",
          href: "/parties",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
