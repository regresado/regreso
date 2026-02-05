import { api } from "~/trpc/server";

import { FeedPage } from "~/app/(platform)/_components/feed";

export default async function DestinationFeedPage({
  params,
}: {
  params: Promise<{ feedId: string }>;
}) {
  const { user } = await api.session.get({});
  const { items: workspaces } = await api.workspace.getMany({ limit: 30 });
  return (
    <div className="grid grid-cols-1 xl:grid-cols-1">
      <ListPage id={(await params).feedId} workspaces={workspaces} user={user} />
    </div>
  );
}
