"use client";

import { cloneElement, isValidElement, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ChevronsUpDown, FileQuestion, Home, Map, Search } from "lucide-react";
import type { User } from "~/server/models";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarTriggerRight,
} from "~/components/ui/sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";
import { SidebarLeft } from "~/components/sidebar-left";
import { SidebarRight } from "~/components/sidebar-right";

interface ClientLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

export function ClientLayout({ children, user }: ClientLayoutProps) {
  const pathname = usePathname();
  const platformRoute = pathname.split("/")[1]?.split("/") ?? ["unknown"];
  const [searchType, setSearchType] = useState(platformRoute[1]);
  const router = useRouter();
  function selectSearchType(value: string) {
    router.push(`/search/${value}`);
    setSearchType(value);
  }
  const platformPages = [
    {
      render: (
        <BreadcrumbItem>
          <Home size="16" />
          <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
        </BreadcrumbItem>
      ),
      name: "Home",
      route: "dashboard",
    },
    {
      render: (
        <BreadcrumbItem>
          <Map size="16" />
          <BreadcrumbLink href="/search/maps">Maps</BreadcrumbLink>
        </BreadcrumbItem>
      ),
      name: "Map",
      route: "map",
    },
    {
      render: (
        <BreadcrumbItem>
          <Search size="16" />
          {platformRoute[0] == "search" ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-2 flex items-center gap-1">
                {searchType == "maps" ? "Map" : "Destination"}
                <ChevronsUpDown size="16" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Search Type</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={platformRoute[1]}
                  onValueChange={selectSearchType}
                >
                  <DropdownMenuRadioItem value="pins" className="pl-3">
                    Destination
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="maps" className="pl-3">
                    Map
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          Search
        </BreadcrumbItem>
      ),
      name: "Search",
      route: "search",
    },
  ];

  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <SidebarLeft side="left" />

        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden lg:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden lg:block" />
                  {platformPages.find((item) => item.route == platformRoute[0]!)
                    ?.render ?? (
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="#"
                        className="flex flex-row items-center gap-2"
                      >
                        <FileQuestion size="16" /> Unknown Route
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <SidebarTriggerRight />
          </header>
          {children && isValidElement(children) ? (
            cloneElement(children, { props: { user } } as {
              props: { user: User };
            })
          ) : (
            <p>
              🌌 Nothing to display on the dashboard right now. Try selecting a
              menu item.
            </p>
          )}
        </SidebarInset>
        <SidebarRight side="right" user={user} />
      </TooltipProvider>
    </SidebarProvider>
  );
}
