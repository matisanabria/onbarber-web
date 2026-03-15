# onbarber-web

Landing page for Onbarber, built with Astro, React, and Tailwind CSS v4. Includes a multi-step booking wizard connected to the Onbarber API.

## Requirements

- Node.js >= 22.12.0
- pnpm >= 10.32.1

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The dev server runs at `http://localhost:4321`.

Edit `.env` with your values:

```
PUBLIC_API_URL=https://api.onbarber.com.py
PUBLIC_WHATSAPP_NUMBER=595983168022
```

## Commands

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Start local dev server            |
| `pnpm build`     | Build for production to `./dist/` |
| `pnpm preview`   | Preview the production build      |

## Stack

- [Astro](https://astro.build) with React integration
- [Tailwind CSS v4](https://tailwindcss.com)
- Booking wizard with barber selection, date/time picking, and WhatsApp confirmation
