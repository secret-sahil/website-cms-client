"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllSalesOrders } from "@/hooks/useSalesOrders";

export default function Page() {
  const { data } = useGetAllSalesOrders();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Sales Orders",
          href: "/salesOrders",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
