"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "../../../columns";
import React from "react";
import { useGetAllSubCategories } from "@/hooks/useSubCategories";

export default function Page() {
  const { data } = useGetAllSubCategories();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "SubCategories",
          href: "/item-subcategories",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
