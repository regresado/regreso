import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(
  process.cwd(),
  "src/app/(knowledge)/(content)",
);

export function getSortedPostsData(dir = "") {
  // Get file names under /${dir}
  const fileNames = fs.readdirSync(path.join(contentDirectory, dir));
  const allPostsData = fileNames
    .map((fileName) => {
      if (!fileName.endsWith(".md")) return null;
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(contentDirectory, dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      } as PostDataWithoutContent;
    })
    .filter((x) => x !== null);
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string, dir = ""): Promise<PostData> {
  const fullPath = path.join(contentDirectory, dir, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the id and content
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
