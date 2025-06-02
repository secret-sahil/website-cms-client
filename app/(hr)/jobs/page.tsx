"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllJob } from "@/hooks/useJob";

export default function Page() {
  const { data } = useGetAllJob();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Job",
          href: "/jobs",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result?.data?.data : []} />
      </div>
    </AdminLayout>
  );
}
