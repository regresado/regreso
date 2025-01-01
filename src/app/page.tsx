"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Github } from "lucide-react";

import { Button } from "~/components/ui/button";
import { MacbookScroll } from "~/components/ui/macbook-scroll";
import { Tabs } from "~/components/ui/tabs";
import { FeatureCards } from "~/components/feature-cards";
import Hero from "~/components/hero";
import { LandingNavigation } from "~/components/landing-navigation";

function TabsDemo() {
  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Product Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Services",
      value: "services",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Services tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Playground",
      value: "playground",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Playground tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Content",
      value: "content",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Content tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Random",
      value: "random",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Random tab</p>
          <DummyContent />
        </div>
      ),
    },
  ];

  return (
    <div className="b relative mx-auto mb-20 mt-10 flex h-[20rem] w-full max-w-5xl flex-col items-start justify-start [perspective:1000px] md:h-[40rem]">
      <Tabs tabs={tabs} />
    </div>
  );
}

const DummyContent = () => {
  // TODO: Replace with actual content
  return (
    <Image
      src="https://dummyimage.com/1000x1000/000/fff"
      alt="dummy image"
      width="1000"
      height="1000"
      className="absolute inset-x-0 -bottom-10 mx-auto h-[60%] w-[90%] rounded-xl object-cover object-left-top md:h-[90%]"
    />
  );
};

function MacbookScrollDemo() {
  return (
    <div className="w-full overflow-hidden bg-white dark:bg-[#0B0B0F]">
      <MacbookScroll
        title={
          <span>
            Use Anywhere <br /> No kidding.
          </span>
        }
        // badge={<Badge className="h-10 w-10 -rotate-12 transform" />}
        src="/dashboard-screenshot.png"
        showGradient={false}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <div className="lamding-page min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white">
        <LandingNavigation />
        <Hero />
        <MacbookScrollDemo />
        <section className="py-20 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Key Features
            </h2>

            <FeatureCards />
          </div>
        </section>
        {/* <TabsDemo /> */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 dark:from-slate-950 dark:to-slate-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">Open but Private</h2>

            <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-slate-300">
              Regreso is proudly open source. We believe in the power of
              community-driven development and transparency while being
              committed to privacy and security.
            </p>

            <div className="flex justify-center space-x-4">
              <Link href="https://github.com/your-repo" passHref>
                <Button className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </Button>
              </Link>

              <Link href="/contribute" passHref>
                <Button variant="outline">Contribute</Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="bg-gray-50 py-20 dark:bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to Never Lose Your Digital Trail?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-slate-300">
              Regreso is the digital breadcrumbs tool you never knew you needed.
              Get started for free and take control of your digital life.
            </p>

            <Button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              Get Started for Free
            </Button>
          </div>
        </section>
        <footer className="bg-white py-10 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between">
              <div className="mb-6 w-full md:mb-0 md:w-1/3">
                <h3 className="mb-4 text-xl font-bold">Regreso</h3>

                <p className="text-gray-600 dark:text-slate-400">
                  Your digital breadcrumbs, always at your fingertips.
                </p>
              </div>

              <div className="mb-6 w-full md:mb-0 md:w-1/3">
                <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>

                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/guide"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/repository"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Source Code
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/credits"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Credits
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="w-full md:w-1/3">
                <h4 className="mb-4 text-lg font-semibold">Socials</h4>

                <div className="flex space-x-4">
                  <Link
                    href="https://github.com/your-repo"
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
                &copy; {new Date().getFullYear()} Regreso. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
