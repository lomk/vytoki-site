# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a two-repo project:
- **vytoki-site** (this repo) — Angular 21 frontend for "Гідрокомфорт Експерт", a Ukrainian hydrocomfort/engineering services company
- **vytoki-api** (`../vytoki-api`) — Django 6 + Django REST Framework backend API

The frontend makes relative `/api/...` requests, so in production the frontend and API must be served behind a common reverse proxy (nginx) that routes `/api/` to the Django backend.

## Frontend (vytoki-site)

### Commands

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build to dist/
npm run watch      # dev build with watch mode
npm test           # run unit tests with Vitest
```

There is no proxy configured for `ng serve` — API calls to `/api/` will 404 locally unless you configure one or run behind nginx.

### Architecture

- Angular 21 standalone components (no NgModules)
- Bootstrap 5 for styling (loaded globally via `angular.json`)
- Prettier configured: 100 char line width, single quotes, Angular HTML parser for `.html` files

**Services** (`src/app/`):
- `SectionApiService` — primary service used by all pages; reads language from `localStorage('language')` and appends `?lang=` to every request. Covers both `/api/sections/` and `/api/services/` endpoints plus contacts.
- `ServiceApiService` — older service (no language support); may be superseded by `SectionApiService`.

**Pages** (`src/app/pages/`):
- `HomeComponent` — lists all services via `SectionApiService.getServices()`
- `SectionComponent` — renders a page section by slug via `/:slug` route
- `ServiceComponent` — renders a service by slug via `/services/:slug` route
- `ContactsComponent` — renders contacts

**Routing** (`app.routes.ts`): `/:slug` (SectionComponent) catches all unmatched slugs before `**`. Services are at `/services/:slug`.

## Backend (vytoki-api)

### Commands

```bash
cd ../vytoki-api
python manage.py runserver          # dev server at http://127.0.0.1:8000
python manage.py migrate
python manage.py createsuperuser
python manage.py test api           # run tests for the api app
```

### Configuration

Requires a `.env` file in the repo root with:
```
DJANGO_SECRET_KEY=...
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=127.0.0.1
DB_PORT=3306
CSRF_TRUSTED_ORIGINS=http://localhost
```

Database is **MySQL** (not SQLite). `mysqlclient` or equivalent must be installed.

### Architecture

Single Django app `api/` with:
- **Models**: `Service`, `ServiceImage`, `ServiceArticle`, `ServiceArticleImage`, `Section`, `SectionImage`, `SectionArticle`, `SectionArticleImage`, `Contacts`
- **Multilingual pattern**: all text fields are duplicated with `_en`, `_uk`, `_ru` suffixes (e.g. `title_en`, `title_uk`, `title_ru`). Views read the `?lang=` query param (default `en`) and return a single-language flat response via `get_field(obj, field_name, lang)`.
- **Views**: function-based `@api_view(["GET"])` views — no serializers, hand-built dicts.
- **URLs** (`/api/`): `services/`, `services/<slug>/`, `services/<slug>/articles/`, `services/<slug>/articles/<id>/`, `sections/<slug>/`, `sections/<slug>/articles/`, `sections/<slug>/articles/<id>/`, `contacts/`

`Section` and `Service` are structurally identical models but serve different URL namespaces. `Section` is described as "legacy" in the frontend service.

Media files are served at `/media/` in development via `urls.py`; in production use nginx.
