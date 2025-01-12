import * as React from "react";

import { LandingNavigation } from "~/components/landing-navigation";
import NotFound from "~/components/not-found";

export default function NotFoundPage() {
  return (
    <div className="bg-white text-gray-900 dark:bg-slate-950 dark:text-white">
      <LandingNavigation />

      <NotFound />
    </div>
  );
}
