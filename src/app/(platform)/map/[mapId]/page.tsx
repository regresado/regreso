import { ListPage } from "~/app/(platform)/_components/list";

export default async function MapPage({
  params,
}: {
  params: Promise<{ mapId: string }>;
}) {
  return (
    <div className="flex h-svh w-full">
      <ListPage id={(await params).mapId} />
    </div>
  );
}
