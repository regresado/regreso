import React from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "~/styles/markdown.css";

import { getPostData, getSortedPostsData } from "~/lib/blog";

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
  return (
    <div className="align-center min-w-sm mx-auto max-w-3xl space-y-8 pt-4">
      <div className="flex flex-col space-y-3">
        <div className="flex flex-row items-end space-x-3">
          <h1 className="text-3xl font-extrabold">{postData.title}</h1>
          <p className="align-end text-muted-foreground">{postData.date}</p>
        </div>
        <p className="text-muted-foreground">{postData.description}</p>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {postData.content}
      </ReactMarkdown>
    </div>
  );
}
