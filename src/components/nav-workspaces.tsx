import Link from "next/link";

import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";

export function NavWorkspaces({
  workspaces,
}: {
  workspaces: {
    name: string;
    emoji: React.ReactNode;
    pages: {
      name: string;
      emoji: React.ReactNode;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Boxes</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.length > 0 ? (
            workspaces.map((workspace) => (
              <SidebarMenuItem key={workspace.name}>
                <Collapsible>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <span>{workspace.emoji}</span>
                      <span>{workspace.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                      showOnHover
                    >
                      <ChevronRight />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <SidebarMenuAction showOnHover>
                    <Plus />
                  </SidebarMenuAction>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {workspace.pages.map((page) => (
                        <SidebarMenuSubItem key={page.name}>
                          <SidebarMenuSubButton asChild>
                            <a href="#">
                              <span>{page.emoji}</span>
                              <span>{page.name}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            ))
          ) : (
            <p className="my-3 px-4 text-sm text-muted-foreground">
              🧰 No boxes found. Try creating one and come back!
            </p>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal />
              <Link href="/search/boxes">
                <span>More</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
