"use client";

import * as React from "react";
import {
  ArrowDownFromLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  BadgeIndianRupee,
  Building,
  GalleryVerticalEnd,
  Hammer,
  House,
  Layers,
  Layers2,
  ListCheck,
  Package,
  Package2,
  Ruler,
  Scale,
  Shield,
  Store,
  Users,
  Wallet,
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

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@factroo.com",
    avatar: "/avatars/admin.jpg",
  },
  dataMaster: [
    {
      name: "Divisions",
      url: "/divisions",
      icon: Building,
    },
    {
      name: "Categories",
      url: "/item-categories",
      icon: Layers,
    },
    {
      name: "Sub Categories",
      url: "/item-subcategories",
      icon: Layers2,
    },
    {
      name: "Units of Measure",
      url: "/units",
      icon: Ruler,
    },
    {
      name: "Unit Conversions",
      url: "/unit-conversions",
      icon: Scale,
    },
    {
      name: "Items",
      url: "/items",
      icon: Package,
    },
    {
      name: "Parties",
      url: "/parties",
      icon: Users,
    },
    {
      name: "Storages",
      url: "/storages",
      icon: Package2,
    },
    {
      name: "Bill of materials (BOM)",
      url: "/boms",
      icon: ListCheck,
    },
  ],

  actions: [
    {
      name: "Inventory",
      url: "/inventory",
      icon: Store,
    },
    {
      name: "Purchase",
      url: "/purchase",
      icon: Wallet,
    },
    {
      name: "Material Issue",
      url: "/material-issue",
      icon: ArrowRightLeft,
    },
    {
      name: "Production",
      url: "/production",
      icon: Hammer,
    },
    {
      name: "Sale",
      url: "/sales",
      icon: BadgeIndianRupee,
    },
  ],

  jobOrders: [
    {
      name: "Purchase Order",
      url: "/purchase-order",
      icon: Wallet,
    },
    {
      name: "Sales Order",
      url: "/salesOrders",
      icon: ArrowRightLeft,
    },
    {
      name: "Job Work (Issue)",
      url: "/job-work-issue",
      icon: ArrowUpFromLine,
    },
    {
      name: "Job Work (Received)",
      url: "/job-work-received",
      icon: ArrowDownFromLine,
    },
    {
      name: "Admin",
      url: "/admin",
      icon: Shield,
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
        <NavMain title="Data Master" projects={data.dataMaster} />
        <NavMain title="Items Actions" projects={data.actions} />
        <NavMain title="Job Orders" projects={data.jobOrders} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user?.result.data} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
