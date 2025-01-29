"use client";

import Link from "next/link";

import { useTranslate } from "@tolgee/react";
import { ChevronRightIcon, ExternalLink, Github, MenuIcon } from "lucide-react";

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
import { ThemeToggle } from "~/components/landing-theme-toggle";
import { Logo } from "~/components/logo";

// TODO: Make Side Navigation Sheet share component with marketing one
export function LandingNavigation() {
  const { t } = useTranslate("Navigation");
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
                    href={t("Navigation.tabs.dashboard.link")}
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    <span className="mr-2 inline align-middle">
                      {t("Navigation.tabs.dashboard.name", "Dashboard")}{" "}
                    </span>

                    <ExternalLink size="18" className="inline align-middle" />
                  </Link>
                  <Collapsible className="grid gap-4">
                    <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                      {t("Navigation.tabs.about.name", "About")}{" "}
                      <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="-mx-6 grid gap-6 bg-muted p-6">
                        <Link
                          href={t("Navigation.submenus.features.link")}
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.features.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.features.description")}
                          </div>
                        </Link>
                        <Link
                          href={t("Navigation.submenus.repo.link")}
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.repo.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.repo.description")}
                          </div>
                        </Link>
                        <Link
                          href={t("Navigation.submenus.credits.link")}
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.credits.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.credits.description")}
                          </div>
                        </Link>
                        <Link
                          href={t("Navigation.submenus.privacy.link")}
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.privacy.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.privacy.description")}
                          </div>
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible className="grid gap-4">
                    <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                      {t("Navigation.tabs.resources.name", "Resources")}{" "}
                      <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="-mx-6 grid gap-6 bg-muted p-6">
                        <Link
                          href={t("Navigation.submenus.guide.link")}
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.guide.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.guide.description")}
                          </div>
                        </Link>
                        <Link
                          href={t("Navigation.submenus.wiki.link")}
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.wiki.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.wiki.description")}
                          </div>
                        </Link>
                        <Link
                          href={t("Navigation.submenus.roadmap.link")}
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.roadmap.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.roadmap.description")}
                          </div>
                        </Link>
                        <Link
                          href={t("Navigation.submenus.discussions.link")}
                          className="group grid h-auto w-full justify-start gap-1"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.discussions.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.discussions.description")}
                          </div>
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Link
                    href={t("Navigation.tabs.blog.link", "Blog")}
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    {t("Navigation.tabs.blog.name")}
                  </Link>
                  <div className="flex w-full items-center justify-start gap-4">
                    <Button className="w-full" variant="outline" size="sm">
                      {t("loginBtn", "Log in")}
                    </Button>
                    <Button className="w-full bg-cyan-500" size="sm">
                      {t("signupBtn", "Sign up")}
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
                      href={t("Navigation.tabs.dashboard.link")}
                      target="_blank"
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      <span className="mr-2 inline align-middle">
                        {t("Navigation.tabs.dashboard.name")}{" "}
                      </span>

                      <ExternalLink size="16" className="inline align-middle" />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {t("Navigation.tabs.about.name")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] p-2">
                      <NavigationMenuLink asChild>
                        <Link
                          href={t("Navigation.submenus.features.link")}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.features.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.features.description")}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href={t("Navigation.submenus.repo.link")}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.repo.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.repo.description")}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href={t("Navigation.submenus.credits.link")}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.credits.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.credits.description")}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href={t("Navigation.submenus.privacy.link")}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.privacy.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.privacy.description")}
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
                          href={t("Navigation.submenus.guide.link")}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.guide.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.guide.description")}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href={t("Navigation.submenus.wiki.link")}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.wiki.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.wiki.description")}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href={t("Navigation.submenus.roadmap.link")}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.roadmap.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.roadmap.description")}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href={t("Navigation.submenus.discussions.link")}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          prefetch={false}
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {t("Navigation.submenus.discussions.name")}
                          </div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("Navigation.submenus.discussions.description")}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href={t("Navigation.tabs.blog.link")}
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      {t("Navigation.tabs.blog.name")}
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
                <Link href="/log-in">{t("loginBtn")}</Link>
              </Button>

              <Button
                className="bg-cyan-700 text-white hover:bg-cyan-800"
                asChild
              >
                <Link href="/sign-up">{t("signupBtn")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  const { t } = useTranslate("Navigation");
  const quickLinks = ["guide", "blog", "repo", "credits", "privacy"] as const;

  return (
    <footer className="bg-white py-10 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="mb-6 w-full md:mb-0 md:w-1/3">
            <h3 className="mb-4 text-xl font-bold">Regreso</h3>

            <p className="text-gray-600 dark:text-slate-400">
              {t("Navigation.footerSubtitle")}
            </p>
          </div>

          <div className="mb-6 w-full md:mb-0 md:w-1/3">
            <h4 className="mb-4 text-lg font-semibold">
              {t("Navigation.footerLinkTitle")}
            </h4>

            <ul className="space-y-2">
              {quickLinks.map((key) => (
                <li key={key}>
                  <Link
                    href={t(`Navigation.submenus.${key}.link`)}
                    className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    {t(`Navigation.submenus.${key}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-1/3">
            <h4 className="mb-4 text-lg font-semibold">
              {t("Navigation.footerSocialsTitle")}
            </h4>

            <div className="flex space-x-4">
              <Link
                href={"/repository"}
                aria-label="GitHub Repository for Regreso"
                className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
              >
                <Github className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-600 dark:border-slate-800 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Regreso.{" "}
            {t("Navigation.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
