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
│   │   ├── prayerTimes/settings.json Coordinates, calc method, Iqamah times
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

## Daily prayer times

Adhan (call to prayer) times are **calculated automatically** — `src/lib/prayerTimes.ts` uses the
[`adhan`](https://www.npmjs.com/package/adhan) library with NAMCC's coordinates and the ISNA
(`NorthAmerica`) calculation method, `Shafi` madhab. This was reverse-matched against namcc.org's
published times (see `_adjustmentsNote` in `settings.json`) to within 1 minute.

Iqamah (start of congregational prayer) is **not** calculated — it's manually set by mosque staff and
must be kept up to date by hand in `src/content/prayerTimes/settings.json`, under `iqamah`. Maghrib is
the one exception: it's kept as a fixed number of minutes after Adhan (`maghribOffsetMinutes`), matching
how the mosque actually runs it, so it never needs manual updates.

Times are computed twice: once at build time (so the static HTML always shows *something* correct as of
the last deploy) and again client-side on page load (so a visitor loading a stale build still sees
today's actual times, not whatever day the site was last deployed).

There's no automated way to pull this data from namcc.org's current site — it runs on a private
WordPress plugin (MadinaApps) with no public API, and MadinaApps' own platform doesn't document one
either. If that changes, or if the Iqamah times drift from what's actually announced at the masjid,
update `settings.json` directly.

## Learn more

- [Astro docs](https://docs.astro.build)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
