"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllStorages } from "@/hooks/useStorages";

export default function Page() {
  const { data } = useGetAllStorages();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Storages",
          href: "/storages",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
