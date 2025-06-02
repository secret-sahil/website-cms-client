"use client";
import AdminLayout from "@/components/layout/admin/page";
import Form from "./form";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = React.use(params).id;
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Job Openings",
          href: "/jobs",
        },
        {
          label: "Update Job Opening",
          href: "/jobs/create",
        },
      ]}
    >
      <div className="px-4">
        <Form id={id} />
      </div>
    </AdminLayout>
  );
}
