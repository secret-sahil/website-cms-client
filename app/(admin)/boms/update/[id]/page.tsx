"use client";
import AdminLayout from "@/components/layout/admin/page";
import Form from "./form";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number(React.use(params).id);
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Boms",
          href: "/boms",
        },
        {
          label: "Update Bom",
          href: "/boms/update",
        },
      ]}
    >
      <div className="px-4">
        <Form id={id} />
      </div>
    </AdminLayout>
  );
}
