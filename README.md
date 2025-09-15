## 🐿️ Regreso - Find your way back

[![Netlify Status](https://api.netlify.com/api/v1/badges/9186e8eb-17c0-4d34-bdd9-e2add4200741/deploy-status)](https://app.netlify.com/sites/regreso/deploys)
[![wakatime](https://wakatime.com/badge/user/7482ea9d-3085-4e9b-95ad-1ca78a14d948/project/2972fea6-6fe2-4f55-afb8-a47ff01540ad.svg)](https://wakatime.com/badge/user/7482ea9d-3085-4e9b-95ad-1ca78a14d948/project/2972fea6-6fe2-4f55-afb8-a47ff01540ad)
![MIT License](https://img.shields.io/github/license/matmanna/regreso)
[![All Contributors](https://img.shields.io/github/all-contributors/regresado/regreso?color=ee8449&style=flat-square)](#-acknowledgements)
![Closed Pull Request Count](https://img.shields.io/github/issues-pr-closed/matmanna/regreso)
![GitHub Repo stars](https://img.shields.io/github/stars/matmanna/regreso)

## 👋 Introduction

Regreso is an open source tool for creating, finding, and managing the links, files, and resources you wish to "return" to later.

These destinations may be organized into "maps", enabling graphing and visualization of relationships, "tags", project or topic-centered "trunk" workspaces, and eventually session "journies".

> [!Note]
> Visit the wiki for a [feature overview](https://github.com/matmanna/regreso/wiki/Feature-Comparison-Table) or [UI showcase](https://github.com/matmanna/regreso/wiki/UI-Showcase). If it interests you, leave a ⭐!

**🤔 Philosophy:**

Regreso aims to create a new form of anti-productivity application which encourages the rejection of traditional notetaking, project management, and organization products. Acting as an extension of the user's mind, Regreso aims to provide maximum freedom, extensibility, and customization.

## 💥 Quick Links

- [Website](https://regreso.netlify.app)
- [Dashboard](https://regreso.netlify.app/dashboard)
- [Guide](https://regreso.netlify.app/guide)
- [Wiki](https://regreso.netlify.app/wiki)
- [Roadmap](https://regreso.netlify.app/roadmap)

## 📺 Demo Video

https://github.com/user-attachments/assets/96565cff-49d1-4a43-8629-4c17b4dc6669

## 🌟 Features

- Destinations (locations or notes) and Maps (lists)
- Powerful text or tag- based search ([#50](https://github.com/regresado/regreso/pull/50))
- Workspace categorization and archival ([#111](https://github.com/regresado/regreso/pull/111))
- Email/GitHub Auth, 2FA (webauthn) ([#8](https://github.com/regresado/regreso/pull/8)
- Knowledge, landing, and blog website ([#28](https://github.com/regresado/regreso/pull/28))
- AI-powered auto-tagging ([#336](https://github.com/regresado/regreso/pull/336))
- Light/dark UI modes and custom theme ([#27](https://github.com/regresado/regreso/pull/27))
- Simple REST API ([#83](https://github.com/regresado/regreso/pull/83))
- GitHub Wiki-based [documentation](https://github.com/regresado/regreso/wiki)
- PostHog Analytics ([#85](https://github.com/regresado/regreso/pull/85))
- [Raycast Extension](https://github.com/regresado/raycasting) client

## 🤝 Contributing

Regreso is licensed under the [MIT license](LICENSE.md), a permissive license which allows you to modify, fork, extend, or redistribute the source code.

We accept contributions of new features and bug fixes through [Pull Requests](/pulls) and general suggestions/bug reports through [Issues](/issues). Before opening either of these, please check if a similar issue/PR has already been opened/assigned and if unsure about its assignment/development status, please ask before potentially creating a duplicate.

**For security reports, please [submit](/security) a private vulnerability disclosure with the relevant information!**

## 🚀 Development

To fork/extend Regreso, it is recommended that you use Supabase or any other Postgres database provider. To develop locally, you can run the `start-database.sh` file to easily create a new Postgres database with Docker. Alternatively, the `setup.sql` provides the full database schema.

Many environment variables are also required for Regreso development. These are also documented in the `.env.example` file.

To install dependencies, run `pnpm install` and to build/start server, use `pnpm run dev` or `pnpm run build && pnpm run start`.

### 🗺️ Roadmap

Regreso has a detailed roadmap hosted as a github [project](/projects). Additionally, key upcoming work includes rss compatibility, local support, a mobile app, and auth/api overhaul. Follow open pull requests to keep up with progress!

## 🔨 Built with

- Framework: Next.js 15 + App Router + Typescript
- Design System: Tailwind + Radix UI + shadcn-ui
- Backend: tRPC + Lucia Auth + Drizzle
- Services: Upload Thing, Supabase, Netlify, PostHog
- UI: TipTap, DND Kit, Emoji Mart, Boring Avatars, Lucide Icons
- Libraties: React Query + Zod
- DX: pnpm, Million Lint, All Contributors

## 🙌 Acknowledgements

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/matmanna"><img src="https://avatars.githubusercontent.com/u/91392083?v=4?s=100" width="100px;" alt="Mat Manna"/><br /><sub><b>Mat Manna</b></sub></a><br /><a href="https://github.com/regresado/regreso/commits?author=matmanna" title="Code">💻</a> <a href="https://github.com/regresado/regreso/issues?q=author%3Amatmanna" title="Bug reports">🐛</a> <a href="#blog-matmanna" title="Blogposts">📝</a> <a href="#content-matmanna" title="Content">🖋</a> <a href="#infra-matmanna" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/regresado/regreso/commits?author=matmanna" title="Documentation">📖</a> <a href="#design-matmanna" title="Design">🎨</a> <a href="#ideas-matmanna" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-matmanna" title="Maintenance">🚧</a> <a href="#projectManagement-matmanna" title="Project Management">📆</a> <a href="#video-matmanna" title="Videos">📹</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
