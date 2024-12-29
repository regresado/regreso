import Link from "next/link";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "~/styles/markdown.css";

import type { PostData } from "~/lib/knowledge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

export function SiteContent(props: { postData: PostData }) {
  return (
    <>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-row items-end space-x-3">
          <h1 className="text-3xl font-extrabold">{props.postData.title}</h1>
          <a
            href={`${process.env.REPO_URL}/blob/${process.env.REPO_MAIN_BRANCH ?? "main"}/src/app/(knowledge)/blog/[slug]/${props.postData.id}.md`}
            className="p-0"
          >
            <p className="align-end text-muted-foreground">
              {props.postData.date}
            </p>
          </a>
        </div>
        {props.postData.authors != undefined ? (
          <div className="flex flex-row items-center space-x-3">
            <p className="mr-3 text-muted-foreground">By </p>
            {props.postData.authors.map((author, index) => (
              <div
                className={`!ml-0 z-${props.postData.authors ? (props.postData.authors.length - index) * 10 : 0} overflow-visible ${props.postData.authors && index == props.postData.authors.length - 1 ? "" : "w-6"} hover:z-100`}
                key={author}
              >
                <Link
                  href={`https://github.com/${author == "default" ? process.env.DEFAULT_PUBLISHER : author}`}
                >
                  <Avatar className="m-0 h-8 w-8">
                    <AvatarImage
                      src={`https://github.com/${author == "default" ? process.env.DEFAULT_PUBLISHER : author}.png`}
                      alt={`@${author == "default" ? process.env.DEFAULT_PUBLISHER : author}`}
                    />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            ))}
            <p className="text-muted-foreground">
              {props.postData.authors != undefined
                ? props.postData.authors.slice(0, 4).map((author, index) => (
                    <span key={author}>
                      <Button variant="link" asChild className="p-0">
                        <Link
                          href={`https://github.com/${author == "default" ? process.env.DEFAULT_PUBLISHER : author}`}
                        >
                          {author == "default"
                            ? process.env.DEFAULT_PUBLISHER
                            : author}
                        </Link>
                      </Button>
                      {props.postData.authors != undefined
                        ? index < props.postData.authors.length - 1
                          ? ", "
                          : ""
                        : ""}
                    </span>
                  ))
                : null}
              <Link href={process.env.REPO_URL ?? "/"}>
                {props.postData.authors.length > 4
                  ? `+${props.postData.authors.length - 4} more`
                  : ""}
              </Link>
            </p>
          </div>
        ) : null}
        <div className="flex flex-row items-end space-x-3">
          <p className="text-muted-foreground">{props.postData.description}</p>
        </div>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {props.postData.content}
      </ReactMarkdown>
    </>
  );
}
