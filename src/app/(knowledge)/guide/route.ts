import { globalGETRateLimit } from "~/server/request";

export async function GET() {
  if (!(await globalGETRateLimit())) {
    return new Response("Too many requests", {
      status: 429,
    });
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: process.env.NEXT_PUBLIC_REPO_URL ?? "/",
    },
  });
}
