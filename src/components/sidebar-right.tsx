import * as React from "react";

import { Plus } from "lucide-react";
import type { User } from "~/server/models";

import { Badge } from "~/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { Calendars } from "~/components/calendars";
import { DatePicker } from "~/components/date-picker";
import { NavUser } from "~/components/nav-user";

// This is sample data.
const data = {
  calendars: [
    {
      name: "My Calendars",
      items: ["Reminders", "General"],
    },
    {
      name: "Maps",
      items: [],
    },
  ],
};

export function SidebarRight({
  user,
  ...props
}: { user: User | null } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>
                New Calendar
                <Badge className="ml-2" variant="secondary">
                  Soon!
                </Badge>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
