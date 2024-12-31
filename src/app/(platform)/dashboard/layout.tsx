import { cloneElement, isValidElement } from "react";

import { Home } from "lucide-react";
import { User } from "~/server/models";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function DashboardLayout({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex items-center justify-between p-4 border-">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Home size="16" />
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {/* <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/workspace/">
                  🖼️ Frontend Development
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  🎨 Design Components
                </BreadcrumbPage>
              </BreadcrumbItem> */}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {children && isValidElement(children)
        ? cloneElement(children, { props: { user } } as {
            props: { user: User };
          })
        : null}
    </>
  );
}
