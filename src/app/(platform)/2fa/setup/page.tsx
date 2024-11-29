import Link from "next/link";

import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  return (
    <>
      <h1>Set up two-factor authentication</h1>
      <ul>
        <li>
          <Link href="/2fa/totp/setup">Authenticator apps</Link>
        </li>
        <li>
          <Link href="/2fa/passkey/register">Passkeys</Link>
        </li>
        <li>
          <Link href="/2fa/security-key/register">Security keys</Link>
        </li>
      </ul>
    </>
  );
}
