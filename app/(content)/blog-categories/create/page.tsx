"use client";
import AdminLayout from "@/components/layout/admin/page";
import Form from "./form";

export default function Page() {
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Categories",
          href: "/blog-categories",
        },
        {
          label: "Create Category",
          href: "/blog-categories/create",
        },
      ]}
    >
      <div className="px-4">
        <Form />
      </div>
    </AdminLayout>
  );
}
