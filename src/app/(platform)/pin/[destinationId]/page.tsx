import { DestinationDialog } from "~/app/(platform)/_components/destination";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ destinationId: string }>;
}) {
  return (
    <div className="flex h-svh items-center justify-center">
      <DestinationDialog id={(await params).destinationId} />
    </div>
  );
}
