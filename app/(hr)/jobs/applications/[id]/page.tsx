"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllApplications } from "@/hooks/useApplications";
import { useSearchParams } from "next/navigation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = React.use(params).id;
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const { data } = useGetAllApplications({
    jobOpeningId: id,
  });
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Job",
          href: "/jobs",
        },
        {
          label: `Applications - ${title}`,
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
