"use client";

import { api } from "~/trpc/react";
import {
  ArrowUpRight,
  Clock,
  Link,
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import { DialogTrigger } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { DeleteList } from "~/app/(platform)/_components/list";

import { toast } from "./hooks/use-toast";

function SidebarList({
  url,
  emoji,
  name,
  id,
  favorite,
  refetch,
}: {
  url: string;
  emoji: string;
  name: string;
  id: number;
  favorite: boolean;
  refetch: () => void;
}) {
  const sidebar = useSidebar();

  const isMobile = sidebar?.isMobile ?? false;
  const utils = api.useUtils();

  const updateList = api.list.update.useMutation({
    onSuccess: async () => {
      await utils.list.invalidate();
      toast({
        title: favorite ? "Map unfavorited" : "Map favorited",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to update map",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <SidebarMenuItem key={name}>
      <SidebarMenuButton asChild>
        <a href={url} title={name}>
          <span>{emoji}</span>
          <span>{name}</span>
        </a>
      </SidebarMenuButton>
      <DeleteList id={id} routePath="#">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
          >
            <DropdownMenuItem
              onClick={() => {
                updateList.mutate({
                  id,
                  removedTags: ["favorite maps"],
                });
                if (favorite) {
                } else {
                  updateList.mutate({
                    id,
                    newTags: ["favorite maps"],
                  });
                }
              }}
            >
              {favorite ? (
                <StarOff className="text-muted-foreground" />
              ) : (
                <Star className="text-muted-foreground" />
              )}
              <span>{favorite ? "Unfavorite" : "Favorite"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toast({
                  title: "Link copied to clipboard!",
                });
                void navigator.clipboard.writeText(
                  window.location.origin + url,
                );
              }}
            >
              <Link className="text-muted-foreground" />
              <span>Copy Link</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.open(url, "_blank");
              }}
            >
              <ArrowUpRight className="text-muted-foreground" />
              <span>Open in New Tab</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DialogTrigger>
              <DropdownMenuItem>
                <Trash2 className="text-muted-foreground" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </DeleteList>
    </SidebarMenuItem>
  );
}

export function NavLists({
  lists,
  mode,
  setMode,
  refetch,
}: {
  lists: {
    id: number;
    name: string;
    url: string;
    emoji: string;
    favorite: boolean;
  }[];
  mode: "fav" | "rec";
  setMode: (mode: "fav" | "rec") => void;
  refetch: () => void;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="justify-between">
        {mode != "fav" ? "Recent" : "Favorite"} Maps
        <Tooltip>
          <TooltipTrigger
            asChild
            onClick={() => {
              setMode(mode == "fav" ? "rec" : "fav");
            }}
          >
            {mode != "fav" ? <Star /> : <Clock />}
          </TooltipTrigger>{" "}
          <TooltipContent side="bottom">
            {mode != "fav" ? "Show favorites" : "Show recents"}
          </TooltipContent>
        </Tooltip>
      </SidebarGroupLabel>
      <SidebarMenu>
        {lists.length > 0 ? (
          lists.map((item) => {
            return <SidebarList key={item.id} {...item} refetch={refetch} />;
          })
        ) : (
          <p className="my-3 px-4 text-sm text-muted-foreground">
            🗺️ No maps found. Try creating one and come back!
          </p>
        )}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
