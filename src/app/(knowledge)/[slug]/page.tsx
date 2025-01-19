import React from "react";

import { getPostData, getSortedPostsData } from "~/lib/knowledge";

import NotFound from "~/components/not-found";

import { SiteContent } from "../_components/content";

export async function generateStaticParams() {
  return getSortedPostsData().map(({ id }) => ({
    params: {
      slug: id,
    },
  }));
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const postData = await getPostData((await params).slug);

  return postData === "not found" ? (
    <NotFound />
  ) : (
    <div className="pt-28">
      <div className="align-center min-w-sm mx-auto max-w-3xl space-y-8">
        <SiteContent postData={postData} />
      </div>
    </div>
  );
}
