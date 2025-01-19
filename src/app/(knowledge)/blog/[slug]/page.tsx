import React from "react";
import Link from "next/link";

import { getPostData, getSortedPostsData } from "~/lib/knowledge";

import { Button } from "~/components/ui/button";
import NotFound from "~/components/not-found";

import { SiteContent } from "../../_components/content";

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const postData = await getPostData((await params).slug);

  return postData === "not found" ? (
    <NotFound />
  ) : (
    <div className="align-center min-w-sm mx-auto max-w-3xl space-y-8 pt-4">
      <SiteContent postData={postData} />
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
