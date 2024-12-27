import Link from "next/link";
import Image from "next/image";

import { Button } from "~/components/ui/button";

import { formatDate } from "~/lib/utils";
import { getSortedPostsData } from "~/lib/knowledge";

export default async function Blog() {
  const allPostsData = getSortedPostsData("posts");
  return (
    <div className="align-center min-w-sm mx-auto max-w-3xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold">The Regreso Blog</h1>
        <p className="text-muted-foreground">
          The latest articles about Regreso, its development, future, and more —
          hot off the presses.
        </p>
      </div>
      <section>
        {allPostsData.map(({ id, date, title, description, image }, index) => (
          <article key={id} className="flex flex-row">
            {image && (
              <div className="h-24 w-24 rounded-lg border bg-white">
                <Image
                  src={"/assets/blog/" + image}
                  alt={title}
                  width={804}
                  height={452}
                  className="transition-colors"
                  priority={index <= 1}
                />
              </div>
            )}
            <div className="ml-4 flex flex-col">
              <h2 className="text-2xl font-extrabold">{title}</h2>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
              {date && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(date)}
                </p>
              )}
              <Link href={"/blog/" + id} className="absolute inset-0">
                <span className="sr-only">Read Post</span>
              </Link>
            </div>
          </article>
        ))}
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
  );
}
