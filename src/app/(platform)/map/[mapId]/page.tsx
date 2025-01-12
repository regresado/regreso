import { ListPage } from "~/app/(platform)/_components/list";

export default async function MapPage({
  params,
}: {
  params: Promise<{ mapId: string }>;
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-1">
      <ListPage id={(await params).mapId} />
    </div>
  );
}
