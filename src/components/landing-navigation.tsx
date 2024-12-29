import Link from "next/link";

import { ThemeToggle } from "~/components/landing-theme-toggle";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ModeToggle } from "~/components/ui/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ChevronRightIcon, ExternalLink, MenuIcon } from "lucide-react";

// TODO: Make Side Navigation Sheet share component with marketing one
export function LandingNavigation() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/50 backdrop-blur-md dark:bg-slate-900/50">
      <div className="container mx-auto w-full px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="dark:bg-slate-900/2 md:hidden lg:hidden"
                >
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link
                  className="mr-6 flex items-center"
                  href="/"
                  prefetch={false}
                >
                  <Logo className="h-12 w-12" />
                  <span className="mr-2 text-xl font-bold text-gray-900 dark:text-white">
                    Regreso
                  </span>
                  <div className="flex w-full justify-end">
                    <ModeToggle className="block xs:hidden" />
                  </div>
                  <div />
                </Link>
                <div className="grid gap-2 py-6">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    <span className="mr-2 inline align-middle">Dashboard </span>

                    <ExternalLink size="18" className="inline align-middle" />
                  </Link>
                  <Collapsible className="grid gap-4">
                    <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                      About{" "}
                      <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="-mx-6 grid gap-6 bg-muted p-6">
                        <Link
                          href="/features"
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Features
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn about Regreso&apos;s capabilities.
                          </div>
                        </Link>
                        <Link
                          href="/repository"
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Source Code
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse and contribute to the source code.
                          </div>
                        </Link>
                        <Link
                          href="/credits"
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Credits
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Say thanks to those who made Regreso possible.
                          </div>
                        </Link>
                        <Link
                          href="/[rivacy"
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Privacy Policy
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn how we use your data and protect your privacy.
                          </div>
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible className="grid gap-4">
                    <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                      Resources{" "}
                      <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="-mx-6 grid gap-6 bg-muted p-6">
                        <Link
                          href="/guide"
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Guide
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn how to use Regreso and get the most out of it.
                          </div>
                        </Link>
                        <Link
                          href="/wiki"
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Wiki
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn how Regreso works and implement it yourself.
                          </div>
                        </Link>
                        <Link
                          href="/roadmap"
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Roadmap
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            See planned and upcoming Regreso features.
                          </div>
                        </Link>
                        <Link
                          href="/help"
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Discussions
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get help from other users and developers.
                          </div>
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Link
                    href="/blog"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Blog
                  </Link>
                  <div className="flex w-full items-center justify-start gap-4">
                    <Button className="w-full" variant="outline" size="sm">
                      Log in
                    </Button>
                    <Button className="w-full bg-cyan-500" size="sm">
                      Sign up
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
              className="lucide lucide-footprints ml-4 mr-3 hidden xs:block md:ml-0 lg:ml-0"
            >
              <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
              <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
              <path d="M16 17h4" />
              <path d="M4 13h4" />
            </svg>
            <Link
              href="/"
              className="hidden text-xl font-bold text-gray-900 dark:text-white xs:block"
            >
              Regreso
            </Link>

            <NavigationMenu className="hidden items-baseline md:ml-2 md:flex lg:ml-10 lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/dashboard"
                      target="_blank"
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      <span className="mr-2 inline align-middle">
                        Dashboard{" "}
                      </span>

                      <ExternalLink size="16" className="inline align-middle" />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>About</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] p-2">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/features"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Features
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn about Regreso&apos;s capabilities.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/repository"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Source Code
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse and contribute to the source code.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/credits"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Credits
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Say thanks to those who made Regreso possible.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/privacy"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Privacy Policy
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn how we use your data and protect your privacy.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[550px] grid-cols-2 p-2">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/guide"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Guide
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn how to use Regreso and get the most out of it.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/wiki"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Wiki
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn how Regreso works and implement it yourself.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/roadmap"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Roadmap
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            See planned and upcoming Regreso features.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/help"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            Discussions
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get help from other users and developers.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/blog"
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="ml-4 flex items-center space-x-2 lg:space-x-4">
            <div className="hidden xs:block">
              <ThemeToggle />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                asChild
              >
                <Link href="/log-in">Log in</Link>
              </Button>

              <Button
                className="bg-cyan-700 text-white hover:bg-cyan-800"
                asChild
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
