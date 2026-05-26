# Galactic Spacefarer Adventure

A full-stack SAP BTP application built with **SAP CAP (Cloud Application Programming model)** and **SAP Fiori Elements**, created as a technical assessment.

## Tech Stack

- **Backend:** SAP CAP (Node.js + TypeScript)
- **Database:** SQLite (local development)
- **Frontend:** SAP Fiori Elements V4 (List Report + Object Page)
- **Auth:** CAP mocked authentication with role-based access control (RBAC) and attribute-based access control (ABAC)
- **Email:** Nodemailer (Ethereal fallback for local dev)
- **Testing:** Vitest

## Project Structure

```
backend/
├── db/
│   ├── data-model.cds          # Entity definitions (Spacefarers, Planets, Departments, Positions, SpacesuitColors)
│   └── data/                   # CSV seed data
├── srv/
│   ├── spacefarer-service.cds  # OData service definition with RBAC/ABAC restrictions
│   ├── spacefarer-service.ts   # Event handlers (before/after CREATE)
│   ├── spacefarer-validator.ts # Email validation + stardust/skill enhancement logic
│   └── email-service.ts        # SMTP transporter + welcome email sender
├── app/
│   └── spacefarers/
│       ├── annotations.cds     # Fiori Elements UI annotations
│       └── webapp/             # Fiori app (manifest.json, Component.js, index.html)
├── test/                       # Vitest unit tests
├── types/                      # TypeScript type helpers
└── .cdsrc.json                 # CAP config (SQLite + mocked users)
```

## Getting Started

### Prerequisites

- Node.js 18+
- `npm install -g @sap/cds-dk`

### Install & Run

```bash
cd backend
npm install
npm run dev
```

The app will be available at: [http://localhost:4004](http://localhost:4004)

### Fiori UI

Navigate to: [http://localhost:4004/spacefarers/webapp/index.html](http://localhost:4004/spacefarers/webapp/index.html)

> **Tip:** Open [http://localhost:4004/galactic/](http://localhost:4004/galactic/) first in your browser to authenticate, then navigate to the Fiori app.

## Authentication

Mocked users for local development (defined in `.cdsrc.json`):

| User | Password | Role | Planet access |
|------|----------|------|---------------|
| `vivi` | `vivi` | `SpacefarerAdmin` | All planets |
| `bob` | `bob` | `SpacefarerUser` | Planet X only |
| `yoda` | `yoda` | `SpacefarerUser` | Planet Y only |

### Access Control

- **SpacefarerAdmin** — full CRUD access across all planets
- **SpacefarerUser** — can create new spacefarers; can only read/update/delete spacefarers from their own planet (ABAC row-level filtering)

## Features

### Data Model

- `Spacefarers` — core entity with cosmic fields: `stardustCollection`, `wormholeNavigationSkill`, `spacesuitColor`
- `Planets`, `Departments`, `Positions` — lookup entities with associations
- `SpacesuitColors` — fixed value list for the spacesuit color dropdown

### Event Handlers

- **Before CREATE** — validates email format, normalises to lowercase, adds +100 stardust and +5 wormhole navigation skill (capped at max values)
- **After CREATE** — sends a welcome email to the newly created spacefarer (falls back to Ethereal test account if no SMTP config is set)

### Fiori Elements UI

- **List Report** — displays spacefarers with filtering by planet, department, position and spacesuit color; supports sorting and pagination
- **Object Page** — detailed view with editable cosmic fields (stardust collection, spacesuit color, wormhole navigation skill)

## Environment Variables

Create a `.env` file in the `backend/` directory for real SMTP support:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=secret
SMTP_FROM=noreply@example.com
```

Without these, the app falls back to an [Ethereal](https://ethereal.email) test account and logs a preview URL to the console.

## Running Tests

```bash
cd backend
npm test
```

20 unit tests across 4 test files covering email config, transporter creation, mail sending, and spacefarer validation.
