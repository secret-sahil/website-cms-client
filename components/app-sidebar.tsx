"use client";

import * as React from "react";
import {
  Rss,
  GalleryVerticalEnd,
  ChartBarStacked,
  House,
  LaptopMinimalCheck,
  BriefcaseBusiness,
  FileUser,
  User,
  Building,
  Workflow,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import Link from "next/link";
import { useGetUser } from "@/hooks/useUser";
import { env } from "@/env.mjs";

// This is sample data.
const data = {
  content: [
    {
      name: "Blog",
      url: "/blog",
      icon: Rss,
    },
    {
      name: "Blog Categories",
      url: "/blog-categories",
      icon: ChartBarStacked,
    },
    {
      name: "Media",
      url: "/media",
      icon: GalleryVerticalEnd,
    },
  ],

  sales: [
    {
      name: "Leads",
      url: "/leads",
      icon: LaptopMinimalCheck,
    },
  ],

  hr: [
    {
      name: "Job Openings",
      url: "/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Job Applications",
      url: "/applications",
      icon: FileUser,
    },
  ],

  admin: [
    {
      name: "Users",
      url: "/users",
      icon: User,
    },
    {
      name: "Offices",
      url: "/offices",
      icon: Building,
    },
    {
      name: "Integrations",
      url: "/integrations",
      icon: Workflow,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useGetUser();
  const userData = user?.result.data;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{env.NEXT_PUBLIC_APP_NAME}</span>
                  <span className="capitalize border border-border rounded-md px-1 w-fit">
                    {userData?.role}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={"/dashboard"}>
                  <House />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {hasAccess(userData?.role, "content") && (
          <NavMain title="Content" projects={data.content} />
        )}
        {hasAccess(userData?.role, "sales") && <NavMain title="Sales" projects={data.sales} />}

        {hasAccess(userData?.role, "hr") && <NavMain title="Human Resources" projects={data.hr} />}

        {hasAccess(userData?.role, "admin") && <NavMain title="Admin" projects={data.admin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user?.result.data} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function hasAccess(userRole: string | undefined, targetRole: string): boolean {
  if (!userRole) return false;
  if (userRole === "admin") return true;
  return userRole === targetRole;
}
