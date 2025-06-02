"use client";
import AdminLayout from "@/components/layout/admin/page";
import Form from "./form";

export default function Page() {
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Job Openings",
          href: "/jobs",
        },
        {
          label: "Create Job Opening",
          href: "/jobs/create",
        },
      ]}
    >
      <div className="px-4">
        <Form />
      </div>
    </AdminLayout>
  );
}
