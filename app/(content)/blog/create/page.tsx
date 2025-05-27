"use client";
import AdminLayout from "@/components/layout/admin/page";
import Form from "./form";

export default function Page() {
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Blog",
          href: "/blog",
        },
        {
          label: "Create Blog",
          href: "/blog/create",
        },
      ]}
    >
      <div className="px-4">
        <Form />
      </div>
    </AdminLayout>
  );
}
