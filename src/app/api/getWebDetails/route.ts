import type { NextRequest } from "next/server";

import { parse } from "node-html-parser";

export async function POST(req: NextRequest): Promise<Response> {
  const formData = await req.formData();
  const url = formData.get("url");
  if (typeof url !== "string") {
    return new Response("Invalid URL", { status: 400 });
  }
  const htmlResponse = await fetch(url, { signal: AbortSignal.timeout(1200) })
    .then((res) => res.text())
    .catch((_err) => {
      return "Failed to fetch URL";
    });

  if (htmlResponse === "Failed to fetch URL") {
    return new Response(htmlResponse, { status: 400 });
  }

  const doc = parse(htmlResponse);
  const title = [
    doc.querySelector("title")?.text,
    doc.querySelector('meta[property="og:title"')?.getAttribute("content"),
    doc.querySelector('meta[name="twitter:title"]')?.getAttribute("content"),
  ];
  const description = [
    doc.querySelector('meta[name="description"]')?.getAttribute("content"),
    doc
      .querySelector('meta[property="og:description"]')
      ?.getAttribute("content"),
    doc
      .querySelector('meta[name="twitter:description"]')
      ?.getAttribute("content"),
  ];

  return Response.json({
    title,
    description,
  });
}
