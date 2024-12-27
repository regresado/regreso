import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetTitle,
  SheetContent,
} from "~/components/ui/sheet";
import { ModeToggle } from "~/components/ui/mode-toggle";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "~/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "~/components/ui/navigation-menu";

import { Logo } from "~/components/logo";

export default function Navigation() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center border-b px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <SheetTitle>
            <Link className="mr-6 flex items-center" href="/" prefetch={false}>
              <Logo className="h-12 w-12" />
              <span className="mr-2 text-xl font-bold text-gray-900 dark:text-white">
                Regreso
              </span>
              <div className="flex w-full justify-end">
                <ModeToggle />
              </div>
              <div />
            </Link>
          </SheetTitle>
          <div className="grid gap-2 py-6">
            <Link
              href="/dashboard"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              <span className="mr-2 inline align-middle">Dashboard </span>

              <ExternalLink size="16" className="inline align-middle" />
            </Link>
            <Collapsible className="grid gap-4">
              <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                About{" "}
                <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="-mx-6 grid gap-6 bg-muted p-6">
                  <Link
                    href="#"
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
                    href="#"
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
                    href="#"
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
                    href="#"
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
                    href="#"
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
                    href="#"
                    className="group grid h-auto w-full justify-start gap-1"
                    prefetch={false}
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Technical Wiki
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn how Regreso works and implement it yourself.
                    </div>
                  </Link>
                  <Link
                    href="#"
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
                    href="#"
                    className="group grid h-auto w-full justify-start gap-1"
                    prefetch={false}
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Discussions and Issues
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
              <Button className="w-full" size="sm">
                Sign up
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
        <Logo className="h-6 w-6" />
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Regreso
        </span>
      </Link>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/dashboard"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                <span className="mr-2 inline align-middle">Dashboard </span>

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
                    href="#"
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
                    href="#"
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
                    href="#"
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
                    href="#"
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    prefetch={false}
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Technical Wiki
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn how Regreso works and implement it yourself.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
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
                    href="#"
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    prefetch={false}
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Discussions and Issues
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
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                Blog
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex w-full items-center justify-end gap-4">
        <ModeToggle />

        <Button variant="outline" size="sm" asChild>
          <Link href="/log-in">Log in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
      <div />
    </header>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
