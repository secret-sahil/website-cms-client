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
          label: "Blog",
          href: "/blog",
        },
        {
          label: "Update Blog",
          href: "/blog/create",
        },
      ]}
    >
      <div className="px-4">
        <Form id={id} />
      </div>
    </AdminLayout>
  );
}
