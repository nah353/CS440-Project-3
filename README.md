    # Recipe Webapp

Full-stack recipe application with manual recipe publishing, account-based ownership, and Gemini-powered media analysis.

## Project Overview

This project has two apps that run together:

- **Client** (`Vite + React`): `http://localhost:5173`
- **Server** (`Express` API): `http://localhost:4000`

Core capabilities:

- View and search all recipes by title
- Register, login, logout, and restore sessions from a stored token
- Create recipes (authenticated)
- Edit and delete only recipes you created
- Upload an image/video for AI analysis (`/api/ai/analyze`) using Gemini
- Track your own recipes from the **Account** page

## Tech Stack

- **Frontend:** React 18, Vite, React Router DOM
- **Backend:** Node.js, Express, CORS, Multer, Dotenv
- **Auth:** Bearer token sessions (in-memory) + password hashing via Node `crypto.scrypt`
- **AI:** `@google/generative-ai` (Gemini model `gemini-1.5-flash`)
- **Storage:** JSON files (`server/recipes.json`, `server/users.json`)

## Prerequisites

- Node.js LTS (recommended: 18+)
- npm
- (Optional for AI) Gemini API key from https://aistudio.google.com

Verify install:

```powershell
node -v
npm -v
```

If PowerShell blocks scripts:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Setup

From the project folder:

```powershell
cd "...\CS440---Project-1\recipe-webapp"
npm run setup
```

`npm run setup` will:

1. Copy `.env.example` to `.env` for `client` and `server` (if missing)
2. Install root dependencies
3. Install client dependencies
4. Install server AI-related dependencies

## Environment Variables

### `server/.env`

```env
PORT=4000
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
```

### `client/.env`

```env
VITE_API_BASE=http://localhost:4000/api
```

> AI analysis endpoint requires `GEMINI_API_KEY`.

## Run the App

From `recipe-webapp`:

```powershell
npm run dev
```

This runs both apps concurrently:

- Server: `npm --prefix ./server run dev`
- Client: `npm --prefix ./client run dev`

Open `http://localhost:5173`.

## Current UI Behavior

- **Home:** all recipes + title search
- **Add Recipe:** requires login
- **Account:** visible when logged in; shows only your recipes
- **Recipe Detail:** only creator sees active edit/delete actions
- **Scan Food:** marked as beta in UI; backend route is implemented

## Troubleshooting

### `npm run dev` fails immediately

Make sure you are in:

```powershell
cd "...\CS440---Project-1\recipe-webapp"
```

Then run:

```powershell
npm run dev
```

### Port already in use (`4000` or `5173`)

- Stop previous terminals (`Ctrl + C`)
- Close conflicting apps and rerun

### AI analyze errors

- Confirm `server/.env` has a real `GEMINI_API_KEY`
- Restart server after editing `.env`
- Check server logs for Gemini/API parsing details

### Browser loads but API calls fail

- Confirm server is running on `http://localhost:4000`
- Confirm `client/.env` has `VITE_API_BASE=http://localhost:4000/api`
- Restart client/server after env changes

## Credits

Project credits: **Daniel Fillerup, Nyle Huntley, and Travian Lenox**.
