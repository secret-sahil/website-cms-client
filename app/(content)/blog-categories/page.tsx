"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllCategories } from "@/hooks/useCategories";

export default function Page() {
  const { data } = useGetAllCategories();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Categories",
          href: "/item-categories",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
