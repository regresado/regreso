import { Google } from "arctic";
import { GitHub } from "arctic";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  "http://localhost:3000/log-in/google/callback",
);

export const github = new GitHub(
  process.env.GH_CLIENT_ID!,
  process.env.GH_CLIENT_SECRET!,
  null,
);
