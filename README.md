## 🗺️ Regreso - Find your way back

[![Netlify Status](https://api.netlify.com/api/v1/badges/9186e8eb-17c0-4d34-bdd9-e2add4200741/deploy-status)](https://app.netlify.com/sites/regreso/deploys)
[![wakatime](https://wakatime.com/badge/user/7482ea9d-3085-4e9b-95ad-1ca78a14d948/project/2972fea6-6fe2-4f55-afb8-a47ff01540ad.svg)](https://wakatime.com/badge/user/7482ea9d-3085-4e9b-95ad-1ca78a14d948/project/2972fea6-6fe2-4f55-afb8-a47ff01540ad)

## 👋 Introduction

Regreso is an open source application that allows you to create, sync, manage, and find "destinations" (bookmarked links, files, and resources) you wish to "return" to later.

Destinations may be added to "maps", which enable graphing and visualizing relationships using tags, "journies" (saved sessions), and references. "Trunks" allow one to separate maps by subject, topic, or project.

## ⚡ Quick Links

- [Website](https://regreso.netlify.app)
- [Dashboard](https://regreso.netlify.app/dashboard) - Can be used without an account/offline!
- [Guide](https://regreso.netlify.app/guide)
- [Wiki](https://regreso.netlify.app/wiki)
- [Roadmap](https://regreso.netlify.app/roadmap)

## 🚀 Development

To fork/extend Regreso, it is recommended that you use Supabase or any other Postgres database provider. To develop locally, you can run the `start-database.sh` file to easily create a new Postgres database with Docker. Alternatively, the `setup.sql` provides the full database schema.

Many environment variables are also required for Regreso development. These are also documented in the `.env.example` file.

To install dependencies, run `pnpm install` and to build/start server, use `pnpm run dev` or `pnpm run build && pnpm run start`.

## 🤝 Contributing

Regreso is licensed under the [MIT license](LICENSE.md), a permissive license which allows you to modify, fork, extend, or redistribute the source code.

We accept contributions of new features and bug fixes through [Pull Requests](/pulls) and general suggestions/bug reports through [Issues](/issues). Before opening either of these, please check if a similar issue/PR has already been opened/assigned and if unsure about its assignment/development status, please ask before potentially creating a duplicate.

**For security reports, please [submit](/security) a private vulnerability disclosure with the relevant information!**

## ⚙️ Tech Overview

This project uses the [T3 Stack](https://create.t3.gg/) made by [@t3oss](https://github.com/t3oss):

<ul>
<li>
<details>
<summary> 
<a href="https://nextjs.org/">Next.js</a> App Router
</summary>
<ul>
<li>
<a href="https://react.dev/">React</a>
</li>
<li>
<a href="https://vercel.com/font">Geist</a> font typeface
</li>
</ul>
</details>
</li>

<li> <a href="https://www.typescriptlang.org/">Typescript</a> with <a href="https://eslint.org/">ESLint</a> and <a href="https://prettier.io/">Prettier</a> for strong typing, linting, and formatting
</li>
</ul>

<ul>
<li>
<details>
<summary> 
<a href="https://orm.drizzle.team/">Drizzle</a> ORM for Postgres (instead of Prisma)
</summary>
<ul>
<li>
<a href="https://www.postgresql.org/">PostgreSQL</a> database
</li>
</ul>
</details>
</li>
</ul>

<ul>
<li>
<details>
<summary> 
<a href="https://tailwindcss.com/">Tailwind CSS</a>

</summary>
<ul>
<li>
<a href="https://postcss.org/">PostCSS</a> to install and manage Tailwind
</li>
</ul>
</details>
</li>
</ul>

<ul>
<li>
<details>
<summary> 
<a href="https://trpc.io/">tRPC</a> for typesafe API
</summary>
<ul>
<li>
<a href="https://zod.dev/">Zod</a> for schema validation
</li>
<li>
<a href="https://www.npmjs.com/package/superjson/">Superjson</a> to serialize expressions
</li>
<li>
<a href="https://www.npmjs.com/package/server-only/">Server Only</a> for marking modules
</li>
</ul>
</details>
</li>
</ul>

**With custom additions of:**

<ul>
<li>
<details>
<summary> 
<a href="https://ui.shadcn.com/">shadcn/ui</a> copy-pasted components
</summary>
<ul>
<li>
<a href="https://www.radix-ui.com/">Radix UI</a> primitives
</li>
<li>
<a href="https://www.npmjs.com/package/react-day-picker/">React Day Picker</a> calendar picker
</li>
<li>
<a href="https://www.npmjs.com/package/tailwindcss-animate/">Tailwind CSS Animate</a>
</li>
<li>
<a href="https://www.npmjs.com/package/next-themes/">Next Themes</a> UI mode abstraction
</li>
<li>
<a href="https://ui.aceternity.com/">Aceternity UI</a> animated landing page features
</li>
<li>
<a href="https://github.com/Aslam97/shadcn-minimal-tiptap/">Shadcn Minimal Tiptap</a> component
</li>
<li>
<a href="https://emblor.jaleelbennett.com/introduction">Emblor</a> tag selections
</li>
<li>
<a href="https://www.npmjs.com/package/react-day-picker">React Day Picker</a> calendar picker
</li>
<li>
<a href="https://tiptap.dev">TipTap</a> rich text editor
</li>
</ul>
</details>
</li>
</ul>

- [Motion](https://motion.dev/) page animations
- [Lucide](https://lucide.dev/) Icons and [Boring](https://boringavatars.com/) Avatars

<ul>
<li>
<details>
<summary> 
<a href="https://lucia-auth.com/">Lucia Auth</a> implementation (to replace Next Auth)
</summary>
<ul>
<li>
<a href="https://arcticjs.dev/">Arctic</a> OAuth 2.0 Providers
</li>
<li>
<a href="https://oslojs.dev/">Oslo</a> auth packages
</li>
<li>
<a href="https://node-rs.dev/">Node-RS</a> bindings for Argon2
</li>
<li>
<a href="https://www.npmjs.com/package/uqr/">UQR</a> for TOTP QR Codes
</li>
<li>
<a href="https://nodemailer.com/">Nodemailer</a> to send email verification messages
</li>
</ul>
</details>
</li>
</ul>

- [UploadThing](https://uploadthing.com/) for handling user file uplaods
- [Gray Matter](https://www.npmjs.com/package/gray-matter/) and [Remark (react-markdown)](https://remark.js.org/) for blog/site content rendering
