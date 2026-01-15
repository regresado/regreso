import Image from "next/image";
import Link from "next/link";

import { getSortedPostsData } from "~/lib/knowledge";
import { formatDate } from "~/lib/utils";

import { Button } from "~/components/ui/button";

export default async function Blog() {
  const allPostsData = getSortedPostsData("blog");
  return (
    <div className="pt-24">
      <div className="align-center min-w-sm mx-auto max-w-3xl space-y-8">
        <div className="spapagesce-y-3">
          <h1 className="text-3xl font-extrabold">The Regreso Blog</h1>
          <p className="text-muted-foreground">
            The latest articles about Regreso, its development, future, and more
            — hot off the presses.
          </p>
        </div>
        <section className="flex flex-col gap-3">
          {allPostsData.map(
            ({ id, date, title, description, image }, index) => (
              <article key={id} className="flex flex-row flex-wrap w-full justify-center gap-4 border border-neutral-200 dark:border-neutral-400 p-2">
                {image && (
                  <div className="h-max-24 w-full md:w-24 rounded-lg border bg-neutral-200 dark:bg-neutral-400">
                    <Image
                      src={"/assets/blog/" + image}
                      alt={title}
                      width={804}
                      height={452}
                      className="transition-colors grayscale h-24"
                      priority={index <= 1}
                    />
                  </div>
                )}
                <div className="w-full md:w-auto md:flex-grow flex flex-col">
                  <h2 className="text-2xl font-extrabold">{title}</h2>
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                  {date && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(date)}
                    </p>
                  )}
                  <Link href={"/" + id} className="absolute inset-0">
                    <span className="sr-only">Read Post</span>
                  </Link>
                </div>
              </article>
            ),
          )}
        </section>
        <footer>
          <p className="text-sm text-muted-foreground">
            Illustrations by{" "}
            <Button variant="link" asChild className="p-0">
              <Link href="https://popsy.co">Popsy</Link>
            </Button>
          </p>
        </footer>
      </div>
    </div>
  );
}
