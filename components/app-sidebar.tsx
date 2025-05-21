"use client";

import * as React from "react";
import { Rss, GalleryVerticalEnd, ChartBarStacked, House, Store, Wallet } from "lucide-react";

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
  ],

  sales: [
    {
      name: "Inventory",
      url: "/inventory",
      icon: Store,
    },
  ],

  hr: [
    {
      name: "Purchase Order",
      url: "/purchase-order",
      icon: Wallet,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useGetUser();
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
                  <span className="font-semibold">Factroo</span>
                  <span className="">Admin</span>
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
        <NavMain title="Content" projects={data.content} />
        <NavMain title="Sales" projects={data.sales} />
        <NavMain title="Human Resources" projects={data.hr} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user?.result.data} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
