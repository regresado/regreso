# 🏕️ Regreso - Find your way back

## ⚙️ Tech Stack:

This project uses an adapted [T3 Stack](https://create.t3.gg/) and is bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org/) App Router
  - [React](https://react.dev/)
- [Drizzle](https://orm.drizzle.team/) to interact with Postgres DB
  - [Postgres](https://www.postgresql.org/) SQL database
- [Tailwind CSS](https://tailwindcss.com/)
- [tRPC](https://trpc.io/) for typesafe APIs
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io) for linting/formatting

- [Docker](https://docker.com/) to manage database

With custom additions of:

- [Shadcn](https://ui.shadcn.com/)
  - [Radix UI](https://https://www.radix-ui.com/) is relied on by many components
  - [Aceternity UI](https://ui.aceternity.com/) for the attractive animated UI animations on the landing page.
- [Motion](https://motion.dev/) for page and component animations
- [Lucide](https://lucide.dev/) Icons

- [Custom Lucia Auth](https://lucia-auth.com/) to replace Next Auth in T3 stack
  - [Arctic](https://arcticjs.dev/) for OAuth 2.0 Providers
  - [Oslo](https://oslojs.dev/) for Cryptography/Encoding functions
- [UploadThing](https://uploadthing.com/) (also developed by Theo and works really well with t3 stack!)
