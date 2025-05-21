"use client";

import AdminLayout from "@/components/layout/admin/page";
import { useGetUser } from "@/hooks/useUser";
// import { useDashboard } from "@/hooks/useDashboard";
import { Building, ClipboardList, Hammer, LayoutDashboard, Package, Users } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Admins", key: "totalAdmins", icon: Users, href: "/admins" },
  { label: "Total Users", key: "totalCompanies", icon: Building, href: "/employers" },
  { label: "Total Items", key: "totalProducts", icon: Package, href: "/products" },
  { label: "Pending Job ", key: "totalJobSeekers", icon: Hammer, href: "/job-seekers" },
  {
    label: "Open Purchase Orders",
    key: "totalProductCategories",
    icon: ClipboardList,
    href: "/product-categories",
  },
  { label: "Open Sales Orders", key: "totalResumes", icon: LayoutDashboard, href: "/resumes" },
];

export default function Page() {
  // const { data } = useDashboard();
  const { data: user } = useGetUser();
  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
            Welcome {user?.result.data.firstName} 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            @{user?.result.data.username}
          </p>
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          {stats.map(({ label, key, href, icon: Icon }) => (
            <Link
              href={href}
              key={key}
              className="flex items-center justify-between rounded-xl bg-muted/50 p-6 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-neutral-50">
                  {label}
                </h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-neutral-200">
                  {/* {data?.result.data[key as keyof typeof data.result.data] ?? "-"} */}-
                </p>
              </div>
              <Icon className="h-10 w-10 text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
