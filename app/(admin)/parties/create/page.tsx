"use client";
import AdminLayout from "@/components/layout/admin/page";
import Form from "./form";

export default function Page() {
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Parties",
          href: "/parties",
        },
        {
          label: "Create Party",
          href: "/parties/create",
        },
      ]}
    >
      <div className="px-4">
        <Form />
      </div>
    </AdminLayout>
  );
}
