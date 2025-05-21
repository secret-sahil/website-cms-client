"use client";
import AdminLayout from "@/components/layout/admin/page";
import Form from "./form";

export default function Page() {
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Divisions",
          href: "/divisions",
        },
        {
          label: "Create Division",
          href: "/divisions/create",
        },
      ]}
    >
      <div className="px-4">
        <Form />
      </div>
    </AdminLayout>
  );
}
