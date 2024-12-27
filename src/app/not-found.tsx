import * as React from "react";

import NotFound from "~/components/not-found";
import { LandingNavigation } from "~/components/landing-navigation";

export default function NotFoundPage() {
  return (
    <div className="bg-white text-gray-900 dark:bg-slate-950 dark:text-white">
      <LandingNavigation />

      <NotFound />
    </div>
  );
}
