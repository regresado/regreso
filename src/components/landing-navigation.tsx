import Link from "next/link";

import { Button } from "~/components/ui/button";

import { ThemeToggle } from "./landing-theme-toggle";

export function Navigation() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/50 backdrop-blur-md dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-footprints mr-3"
            >
              <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
              <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
              <path d="M16 17h4" />
              <path d="M4 13h4" />
            </svg>

            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Regreso
            </Link>

            <div className="ml-10 hidden md:block">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/about"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  About
                </Link>

                <Link
                  href="/resources"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Resources
                </Link>

                <Link
                  href="/blog"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              asChild
            >
              <Link href="/log-in">Log in</Link>
            </Button>

            <Button className="bg-cyan-500 text-white hover:bg-cyan-600">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
