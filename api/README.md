# Admin API

Express.js + Sequelize boilerplate for the `admin` folder.

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```

## Endpoints

- `GET /`
- `GET /api/health`
- `GET /api/users`
- `POST /api/users`

## Current focus

- `GET /api/current-focus` — public ordered list of active hero focus phrases
- `GET /api/current-focus/:id` — public focus detail for a numeric ID
- `GET /api/current-focus/manage` — authenticated list including hidden phrases
- `POST /api/current-focus` — authenticated create
- `PUT /api/current-focus/:id` — authenticated replacement
- `PATCH /api/current-focus/:id` — authenticated partial update
- `DELETE /api/current-focus/:id` — authenticated delete

Each item stores `title_en`, `title_id`, `sort_order`, and `is_active`. The API
seeds the three initial phrases only when the table is empty.
