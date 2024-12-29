"use client";

import React from "react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { LampContainer } from "~/components/ui/lamp";
import { Footprints } from "lucide-react";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <section className="h-screen max-h-screen overflow-hidden pt-16 md:pt-16">
      {" "}
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-32 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent dark:from-slate-300 dark:to-slate-500 md:text-7xl"
        >
          Page Not Found
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-700 dark:text-slate-300"
        >
          We failed to track down the page you were looking for. It may have
          moved, been deleted, or never existed in the first place.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row"
        >
          <Button
            className="group rounded-md bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90 hover:shadow-lg"
            asChild
          >
            <Link href="/">
              <Footprints className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              Return Home
            </Link>
          </Button>
        </motion.div>
      </LampContainer>
    </section>
  );
}
