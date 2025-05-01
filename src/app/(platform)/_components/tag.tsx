import { useEffect, useState } from "react";

import {
  useDraggable,
  useDroppable,
  type Active,
  type Over,
} from "@dnd-kit/core";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { api } from "~/trpc/react";
import {
  GalleryVerticalEnd,
  ListPlus,
  Plus,
  RefreshCw,
  Tag as TagIcon,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { useAnimation } from "motion/react";
import { List, Tag } from "~/server/models";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DialogHeader } from "~/components/ui/dialog";
import { toast } from "~/components/hooks/use-toast";
import { TiltCard } from "~/components/tilt-card";

export function RecentTags() {
  const utils = api.useUtils();

  const {
    data: recentTags = { items: [], count: 0 },
    refetch,
    isFetching,
  } = api.tag.getMany.useQuery({
    limit: 3,
    order: "DESC",
    sortBy: "updatedAt",
  });
  const [open, setOpen] = useState(false);

  const createTag = (callback?: () => void) =>
    api.list.create.useMutation({
      onSuccess: async () => {
        await utils.list.invalidate();
        if (typeof callback === "function") {
          callback();
        }
        setOpen(false);
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
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <TiltCard>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              <Link href="/search/maps">
                <div className="flex items-center">
                  <Tags className="mr-2 h-5 w-5" /> Recent Tags
                </div>
              </Link>

              <Button id="create-map" onClick={() => setOpen(true)} size="sm">
                <Plus />
                Create Tag
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            {recentTags.items.length > 0 ? (
              recentTags.items.map((tg: Tag) => {
                return <Badge variant="secondary" key={tg.id}>{tg.name}</Badge>;
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                🏷 No tags found. Try creating one and come back!
              </p>
            )}
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={isFetching}
                asChild
              >
                <Link href="/search/pins">
                  <GalleryVerticalEnd />
                  See All
                </Link>
              </Button>
              <Button
                size="sm"
                disabled={isFetching}
                onClick={() => {
                  void refetch();
                }}
              >
                <RefreshCw
                  className={isFetching ? "animate-spin" : undefined}
                />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </TiltCard>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus /> Create Tag
          </DialogTitle>
        </DialogHeader>
        <main className="flex flex-1 flex-col space-y-6 pt-0">
          {/* <TagForm update={false} listMutation={createTag} /> */}
        </main>
      </DialogContent>
    </Dialog>
  );
}
