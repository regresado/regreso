import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";

export function verifyEmailInput(email: string): boolean {
  return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  // const row = db.queryOne("SELECT COUNT(*) FROM user WHERE email = ?", [email]);
  const result = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  console.log(result, result?.email, email);
  return result?.email !== email;
}
