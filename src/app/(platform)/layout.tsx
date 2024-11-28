import { SidebarLeft } from "~/components/sidebar-left";
import { SidebarRight } from "~/components/sidebar-right";
import { HydrateClient } from "~/trpc/server";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
export default function MarketingSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HydrateClient>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>{children}</SidebarInset>
        <SidebarRight />
      </SidebarProvider>
    </HydrateClient>
  );
}
