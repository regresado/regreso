"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Bell,
  CircleUser,
  Keyboard,
  Lock,
  Paintbrush,
  Settings,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar";

const data = {
  nav: [
    { name: "Profile", icon: CircleUser, url: "/dashboard/settings/profile" },

    { name: "Account", icon: Lock, url: "/dashboard/settings/account" },
    {
      name: "Notifications",
      render: (
        <div>
          Notifications
          <Badge className="ml-2" variant="secondary">
            Soon!
          </Badge>
        </div>
      ),
      icon: Bell,
      url: "#notifications",
    },
    {
      name: "Appearance",
      render: (
        <div>
          Appearance <Badge className="ml-2">New</Badge>
        </div>
      ),
      icon: Paintbrush,
      url: "/dashboard/settings/appearance",
    },

    {
      name: "Accessibility",
      render: (
        <div>
          Accessibility{" "}
          <Badge className="ml-2" variant="secondary">
            Soon!
          </Badge>
        </div>
      ),
      icon: Keyboard,
      url: "#accessibility",
    },
    {
      name: "Advanced",
      render: (
        <div>
          Advanced{" "}
          <Badge className="ml-2" variant="secondary">
            Soon!
          </Badge>
        </div>
      ),
      icon: Settings,
      url: "#advanced",
    },
  ],
};

export function SettingsDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const settingsRoute = pathname
    .split("/dashboard/settings/")[1]
    ?.split("/")[0];
  const settingsName = data.nav.find((item) =>
    item.url.includes("settings/" + settingsRoute),
  )?.name;

  function handleOpenChange(openStatus: boolean) {
    setOpen(openStatus);
    if (!openStatus) {
      router.push("/dashboard");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* <DialogTrigger asChild>
        <Button size="sm">Open Dialog</Button>
      </DialogTrigger> */}
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden py-2 md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name == settingsName}
                        >
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.render ?? item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard/settings">
                        Settings
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{settingsName}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            {children}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
