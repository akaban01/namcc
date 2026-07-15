# NAMCC — Astro + Tailwind

A static clone of [namcc.org](https://namcc.org) (North Austin Muslim Community Center), built with
[Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com).

## Project Structure

```text
/
├── public/
│   ├── images/                 Logo, icons, photos
│   └── documents/              PDFs (prayer schedules, forms)
├── src/
│   ├── components/             Header, Footer, section components
│   ├── content/                Site content (JSON/YAML/Markdown)
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
`imams` and `services` collections. Adding a new page means adding both a `src/content/pages/<slug>.md`
file and a matching `src/pages/<slug>/index.astro` route file.

## Commands

| Command             | Action                                           |
| :------------------- | :------------------------------------------------ |
| `npm install`         | Install dependencies                              |
| `npm run dev`          | Start the Astro dev server at `localhost:4321`    |
| `npm run build`        | Build the production site to `./dist/`            |
| `npm run preview`      | Preview the production build locally              |

## Editing content

All content lives as plain JSON/YAML/Markdown files under `src/content/`. Edit those files directly,
commit, and push — Netlify rebuilds and redeploys automatically on every push to `main`.

## Learn more

- [Astro docs](https://docs.astro.build)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
