import fs from "fs";
import path from "path";

import matter from "gray-matter";

const contentDirectory = path.join(
  process.cwd(),
  "src/app/(knowledge)/(content)",
);

export function getSortedPostsData(dir = "") {
  const fileNames = fs.readdirSync(path.join(contentDirectory, dir));
  const allPostsData = fileNames
    .map((fileName) => {
      if (!fileName.endsWith(".md")) return null;
      const id = fileName.replace(/\.md$/, "");

      const fullPath = path.join(contentDirectory, dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);

      return {
        id,
        ...matterResult.data,
      } as PostDataWithoutContent;
    })
    .filter((x) => x !== null);
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(
  id: string,
  dir = "",
): Promise<PostData | "not found"> {
  const fullPath = path.join(contentDirectory, dir, `${id}.md`);
  let fileContents = null;
  try {
    fileContents = fs.readFileSync(fullPath, "utf8");
  } catch (err) {
    return "not found";
  }

  const matterResult = matter(fileContents);

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as PostMatter),
  } as PostData;
}

export interface PostData {
  id: string;
  date: string;
  title: string;
  description?: string;
  image?: string;
  content?: string;
  authors?: string[];
}

type PostDataWithoutContent = Omit<PostData, "content">;

type PostMatter = Omit<PostDataWithoutContent, "id">;
