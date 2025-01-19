import { Toaster } from "~/components/ui/toaster";
import { Footer } from "~/components/landing-navigation";
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
      <main className="mb-16 flex flex-1 flex-col">
        {" "}
        <div className="mx-auto w-full max-w-screen-xl flex-1 px-4">
          {children}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
