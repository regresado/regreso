"use client";

import { Navigation } from "~/components/landing-navigation";
import Hero from "~/components/hero";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { FeatureCards } from "~/components/feature-cards";
import { Github } from "lucide-react";
import { MacbookScroll } from "~/components/ui/macbook-scroll";

import React from "react";
import Image from "next/image";
import { Tabs } from "~/components/ui/tabs";
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
        badge={
          <Link href="https://google.com">
            <Badge className="h-10 w-10 -rotate-12 transform" />
          </Link>
        }
        src={`https://dummyimage.com/1000x1000/000/fff`}
        showGradient={false}
      />
    </div>
  );
}
// Personal logo
const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="13%"
      height="13%"
      viewBox="0 0 423 423"
      version="1.1"
      className={className}
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 2,
      }}
    >
      <rect
        id="Artboard10"
        x="0"
        y="0"
        width="422.571"
        height="422.571"
        style={{ fill: "none" }}
      />
      <clipPath id="_clip1">
        <rect x="0" y="0" width="422.571" height="422.571" />
      </clipPath>
      <g clipPath="url(#_clip1)">
        <circle
          cx="211.285"
          cy="211.285"
          r="211.285"
          style={{ fill: "#ffc200" }}
        />
        <path
          d="M183.45,271.792l-40.336,18.555l-40.335,2.862l-0,-81.92l33.613,16.806l-0.736,21.849"
          style={{ fill: "#fff" }}
        />
        <path
          d="M284.294,117.61l-1.294,-29.968l-71.715,37.469l0,27.856l73.009,-35.357Z"
          style={{ fill: "#fff" }}
        />
        <path
          d="M132.663,117.173l2.993,-26.728l73.949,34.666l0.367,27.856l-77.309,-35.794Z"
          style={{ fill: "#fff" }}
        />
        <path
          d="M209.605,49.947l-73.949,36.974l73.949,36.974l74.684,-36.974l-74.684,-36.974Z"
          style={{ fill: "#fff" }}
        />
        <path
          d="M317.901,265.07l-46.637,23.529l-34.034,-16.807l43.825,-19.543l36.846,12.821l0,-53.696l-33.612,16.721l-0,21.799"
          style={{ fill: "#fff" }}
        />
        <path
          d="M102.693,103.77l107.647,53.738l107.561,-53.78l53.781,26.89l-161.342,80.671l-161.342,-80.671l53.695,-26.848Z"
          style={{ fill: "#fff" }}
        />
        <path
          d="M48.998,130.618c0.042,1.937 -0.735,159.661 -0.735,159.661l100.839,50.42l0.735,-51.916l-44.065,-25.21l-2.993,-48.555l110.187,48.371l104.568,-52.284l0.367,53.597l-47.425,23.713l2.993,52.284l100.839,-50.42l-2.626,-155.932l-161.342,76.574c0,0 -161.384,-82.241 -161.342,-80.303Z"
          style={{ fill: "#fff" }}
        />
        <path
          d="M210.34,123.895l-0.735,33.613"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M284.289,86.921l-0,33.613"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M135.656,86.921l0,33.613"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M149.837,288.599l33.613,-16.807l-47.058,-23.529l-33.613,16.807l-0,-53.781l33.613,16.806l-0,20.168"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M270.843,288.599l-33.613,-16.807l47.059,-23.529l33.612,16.807l0,-53.696l-33.612,16.721l-0,20.168"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M102.779,211.289l107.561,53.781l107.561,-53.781"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M371.682,184.399l0,-53.781l-161.342,80.671l-161.342,-80.671l0,53.781"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M102.693,103.77l107.647,53.738l107.561,-53.78l53.781,26.89l-161.342,80.671l-161.342,-80.671l53.695,-26.848Z"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M102.779,103.728c17.296,8.839 26.89,13.445 26.89,13.445"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M209.605,49.947l-73.949,36.974l73.949,36.974l74.684,-36.974l-74.684,-36.974Z"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M371.682,178.516l0,113.444l-100.839,50.419l0,-53.78l47.058,-23.529l0,-53.781"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <path
          d="M48.998,184.399l-0.735,107.561l100.839,50.419l0.735,-53.78l-47.058,-23.529l-0,-53.781"
          style={{ fill: "none", stroke: "#000", strokeWidth: 11 }}
        />
        <circle
          cx="209.605"
          cy="327.105"
          r="45.519"
          style={{ fill: "#fff", stroke: "#000", strokeWidth: 11 }}
        />
      </g>
    </svg>
  );
};

export default function LandingPage() {
  return (
    <>
      <div className="lamding-page min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white">
        {" "}
        <Navigation />
        <Hero />
        <MacbookScrollDemo />
        {/* Features Section */}
        <section className="bg-gray-50 py-20 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Key Features
            </h2>

            <FeatureCards />
          </div>
        </section>
        <TabsDemo />
        {/* Open Source Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 dark:from-slate-950 dark:to-slate-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">Open Source Power</h2>

            <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-slate-300">
              Regreso is proudly open source. We believe in the power of
              community-driven development and transparency.
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
        {/* CTA Section */}
        <section className="bg-gray-50 py-20 dark:bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to Never Lose Your Digital Trail?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-slate-300">
              Join thousands of users who have streamlined their digital journey
              with Regreso.
            </p>

            <Button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              Get Started for Free
            </Button>
          </div>
        </section>
        {/* Footer */}
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
                      href="/about"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      About
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/team"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Team
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/docs"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Documentation
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/contribute"
                      className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Contribute
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="w-full md:w-1/3">
                <h4 className="mb-4 text-lg font-semibold">Connect</h4>

                <div className="flex space-x-4">
                  <Link
                    href="https://github.com/your-repo"
                    className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    <Github className="h-6 w-6" />
                  </Link>

                  {/* Add more social icons as needed */}
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
