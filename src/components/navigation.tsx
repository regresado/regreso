import Link from "next/link";

import { Button } from "~/components/ui/button";

import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/50 backdrop-blur-md dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Regreso
            </Link>

            <div className="ml-10 hidden md:block">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/about"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  About
                </Link>

                <Link
                  href="/team"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Team
                </Link>

                <Link
                  href="/docs"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Docs
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Log in
            </Button>

            <Button className="bg-cyan-500 text-white hover:bg-cyan-600">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
