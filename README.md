# 🗺️ Regreso - Find your way back

[![Netlify Status](https://api.netlify.com/api/v1/badges/9186e8eb-17c0-4d34-bdd9-e2add4200741/deploy-status)](https://app.netlify.com/sites/regreso/deploys)

## ⚙️ Tech Stack:

This project uses the [T3 Webdev Stack](https://create.t3.gg/) made by [@t3gotgg](https://github.com/t3dotgg):

- [Next.js](https://nextjs.org/) App Router
  - [React](https://react.dev/) frontend library
  - [Geist](https://vercel.com/font) Font Typeface
- [Typescript](https://www.typescriptlang.org/)
- [Drizzle](https://orm.drizzle.team/) ORM to interact with Postgres DB (instead of Prisma)
  - [Postgres](https://www.postgresql.org/) SQL database
- [Tailwind CSS](https://tailwindcss.com/)
  - [PostCSS](https://postcss.org/) to install and handle Tailwind
- [tRPC](https://trpc.io/) for typesafe APIs
  - [Zod](https://zod.dev/) for schema validation
  - [Superjson](https://www.npmjs.com/package/superjson) to safely serialize expressions
  - [Server Only](https://www.npmjs.com/package/server-only/) for marking modules
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io) for linting/formatting

- [Docker](https://docker.com/) to manage database

**With my own custom additions of:**

- [Shadcn](https://ui.shadcn.com/) copy-pasted components
  - [Radix UI](https://https://www.radix-ui.com/) is relied on by many components
  - [React Day Picker](https://www.npmjs.com/package/react-day-picker) calendar selection UI
  - [Input OTP](https://www.npmjs.com/package/input-otp) UI Element for React
  - [React Hook Form](https://react-hook-form.com/) for form validation
  - [Tailwind CSS Animate](https://www.npmjs.com/package/tailwindcss-animate/) easy animation
  - [Next Themes](https://www.npmjs.com/package/next-themes/) simple themes abstraction
  - [Aceternity UI](https://ui.aceternity.com/) for the attractive animated UI animations on the landing page.
- [Motion](https://motion.dev/) for page and component animations
- [Lucide](https://lucide.dev/) Icons
- [Boring](https://boringavatars.com/) Default Avatars

- [Custom Lucia Auth](https://lucia-auth.com/) to replace Next Auth in T3 stack
  - [Arctic](https://arcticjs.dev/) for OAuth 2.0 Providers
  - [Oslo](https://oslojs.dev/) for Cryptography/Encoding functions
  - [Node-RS/Argon2](https://node-rs.dev/) Node bindings for Argon2 in Rust
- [Nodemailer](https://nodemailer.com/) to send email verifications
- [UploadThing](https://uploadthing.com/) for handling user file uplaods
