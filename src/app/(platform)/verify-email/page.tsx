import Link from "next/link";

import { getCurrentSession } from "~/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();

  return <></>;
}
