"use client";

import { useState, startTransition, useActionState } from "react";

import { redirect } from "next/navigation";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LogIn,
} from "lucide-react";

import Avatar from "boring-avatars";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

import type { User } from "~/server/models";

import { logoutAction } from "~/app/(platform)/action";

const initialState = {
  message: "",
};

export function NavUser({ user }: { user: User | null }) {
  const [selectedOptions, setSelectedOption] = useState<string[]>([]);
  const { isMobile } = useSidebar();
  const [, action] = useActionState(logoutAction, initialState);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* TODO: Replace with user's username or "anonymous" */}
              <Avatar name="Alice Paul" variant="beam" className="!h-8 !w-8" />
              {/* <AvatarComp className="h-8 w-8 rounded-lg"> */}
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
              {/* </AvatarComp> */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.name ?? "Anonymous"}
                </span>
                <span className="truncate text-xs">
                  {user?.email ?? "No email provided"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar
                  name="Alice Paul"
                  variant="beam"
                  className="!h-8 !w-8"
                />
                {/* <AvatarComp className="h-8 w-8 rounded-lg"> */}
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </AvatarComp> */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name ?? "Anonymous"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email ?? "Not logged in"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            {user?.name ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(event: Event): void => {
                    startTransition(() => {
                      action();
                    });
                  }}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onSelect={(event: Event): void => {
                    redirect("/log-in");
                  }}
                >
                  <LogIn />
                  Log in
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
