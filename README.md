# NAMCC — Astro + Tailwind + Decap CMS

A static clone of [namcc.org](https://namcc.org) (North Austin Muslim Community Center), built with
[Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and
[Decap CMS](https://decapcms.org) for content editing.

## Project Structure

```text
/
├── public/
│   ├── admin/config.yml        Decap CMS collections config
│   ├── images/                 Logo, icons, uploaded media
│   └── documents/              PDFs (prayer schedules, forms)
├── src/
│   ├── components/             Header, Footer, section components
│   ├── content/                Editable content (JSON/YAML/Markdown)
│   │   ├── settings/site.json      Site-wide settings (contact, socials, links)
│   │   ├── prayerTimes/current.json Daily prayer times table
│   │   ├── jumuah/                 Friday prayer schedule entries
│   │   ├── events/                 Event listings
│   │   ├── imams/                  Imam profiles
│   │   ├── services/               Community service listings
│   │   ├── announcements/          Announcements
│   │   └── pages/                  Long-form pages (About, Donate, etc.)
│   ├── content.config.ts       Astro content collection schemas
│   ├── layouts/BaseLayout.astro
│   └── pages/                  Route files (mostly thin wrappers)
└── package.json
```

Each top-level page under `src/pages/<slug>/index.astro` is a thin wrapper that renders
`<ContentPage slug="<slug>" />`, which pulls its title/body from `src/content/pages/<slug>.md`.
Routes for `/scholars/[imam]/` and `/services/[service]/` are generated automatically from the
`imams` and `services` collections.

**Note:** because pages are static routes (not a catch-all), adding a brand-new page in Decap CMS's
"Pages" collection won't automatically get a route — you'd also need to add a matching
`src/pages/<slug>/index.astro` file. This tradeoff was intentional: a catch-all `/[slug]/` route
was tried first but it shadowed `/admin/` in Astro's router (see below).

## Commands

| Command             | Action                                                         |
| :------------------- | :-------------------------------------------------------------- |
| `npm install`         | Install dependencies                                             |
| `npm run dev`          | Start the Astro dev server at `localhost:4321`                   |
| `npm run cms`          | Start the local Decap CMS proxy server (`decap-server`) on port `8082` |
| `npm run dev:cms`      | Run both of the above together (needed to edit content locally)  |
| `npm run build`        | Build the production site to `./dist/`                           |
| `npm run preview`      | Preview the production build locally                             |

## Editing content locally

1. `npm run dev:cms`
2. Open `http://localhost:4321/admin/` and click **Login** (no credentials needed locally — the
   local backend just talks to the `decap-server` proxy, which writes straight to the files in
   `src/content/`).
3. Edits save directly to disk; the Astro dev server hot-reloads automatically.

## Deploying with a real CMS backend

`public/admin/config.yml` is configured with `backend: git-gateway`, the standard setup for Netlify:

1. Deploy the site to Netlify (or adapt the backend to GitHub/GitLab OAuth if hosting elsewhere).
2. Enable **Netlify Identity** and **Git Gateway** in the Netlify site settings.
3. Invite editors via Netlify Identity — they'll be able to log in at `/admin/` and edit content
   through the same collections used locally, with changes committed to the Git repo (and, since
   `publish_mode: editorial_workflow` is set, routed through draft/review/ready states).

If you don't deploy to Netlify, swap the `backend:` block in `config.yml` for a
[GitHub](https://decapcms.org/docs/github-backend/) or [GitLab](https://decapcms.org/docs/gitlab-backend/)
backend instead.

## Content model notes

- **Site Settings** and **Daily Prayer Times** are singleton "file" collections (one JSON file each) —
  edited as a single form in Decap rather than a list.
- **Friday Prayer Schedule**, **Events**, **Imams**, **Community Services**, and **Announcements**
  are folder collections — one YAML file per entry.
- **Pages** are folder collections of Markdown files with frontmatter (`title`, `description`,
  `heroImage`) plus a Markdown body.
- Placeholder logo, favicon, and imam photo are simple inline SVGs — swap them for real assets via
  Decap's media library (uploads go to `public/images/`) whenever you're ready.

## Learn more

- [Astro docs](https://docs.astro.build)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [Decap CMS docs](https://decapcms.org/docs/intro/)
