"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllMaterialIssues } from "@/hooks/useMaterialIssues";

export default function Page() {
  const { data } = useGetAllMaterialIssues();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Material Issue",
          href: "/material-issue",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
