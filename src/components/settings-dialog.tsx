"use client";

import * as React from "react";

import { useRouter, usePathname } from "next/navigation";

import {
  Bell,
  Keyboard,
  CircleUser,
  Lock,
  Paintbrush,
  Settings,
} from "lucide-react";

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
    // { name: "Navigation", icon: Menu },
    // { name: "Home", icon: Home },
    { name: "Profile", icon: CircleUser, url: "/dashboard/settings/profile" },

    { name: "Account", icon: Lock, url: "/dashboard/settings/account" },
    {
      name: "Notifications",
      icon: Bell,
      url: "/dashboard/settings/notifications",
    },
    {
      name: "Appearance",
      icon: Paintbrush,
      url: "/dashboard/settings/appearance",
    },

    {
      name: "Accessibility",
      icon: Keyboard,
      url: "/dashboard/settings/accessibility",
    },

    // { name: "Messages & media", icon: MessageCircle },
    // { name: "Language & region", icon: Globe },
    // { name: "Accessibility", icon: Keyboard },
    // { name: "Mark as read", icon: Check },
    // { name: "Audio & video", icon: Video },
    // { name: "Connected accounts", icon: Link },
    // { name: "Privacy & visibility", icon: Lock },

    { name: "Advanced", icon: Settings, url: "/dashboard/settings/advanced" },
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
                            <span>{item.name}</span>
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
            {/* <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video max-w-3xl rounded-xl bg-muted/50"
                />
              ))}
            </div> */}
            {children}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
