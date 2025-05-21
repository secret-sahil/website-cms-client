"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetInventoryById } from "@/hooks/useInventory";
import { useSearchParams } from "next/navigation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams();

  const id = Number(React.use(params).id);
  const name = searchParams.get("name");
  const { data } = useGetInventoryById(id, true);
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Inventory",
          href: "/inventory",
        },
        {
          label: `Batches (${name})`,
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result.data : []} />
      </div>
    </AdminLayout>
  );
}
