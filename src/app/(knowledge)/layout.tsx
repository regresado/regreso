import { Toaster } from "~/components/ui/toaster";
import Navigation from "~/components/navigation";

export default function MarketingSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed left-0 right-0 top-0 z-50 bg-white dark:bg-black">
        <Navigation />
      </div>
      <main className="flex flex-1 flex-col pt-16">
        {" "}
        <div className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
