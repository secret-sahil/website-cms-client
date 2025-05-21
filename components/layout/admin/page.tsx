import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";

type Props = {
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
  children: React.ReactNode;
};

function AdminLayout({ breadcrumbs, children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map(({ label, href }, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem key={index} className={index === 0 ? "hidden md:block" : ""}>
                      {index < breadcrumbs.length - 1 ? (
                        <BreadcrumbLink asChild>
                          {href && <Link href={href}>{label}</Link>}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminLayout;
