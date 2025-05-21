"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllBoms } from "@/hooks/useBoms";

export default function Page() {
  const { data } = useGetAllBoms();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Boms",
          href: "/boms",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
