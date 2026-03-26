# Deploying the Backend to Render

This guide walks through getting the Fitness Goal Tracker API live on
[Render](https://render.com) (free tier) and connected to MongoDB Atlas.

---

## Prerequisites

| Requirement | Notes |
|---|---|
| GitHub account | Render deploys directly from a GitHub repo |
| [MongoDB Atlas](https://cloud.mongodb.com) account | Free M0 cluster works fine |
| Your project pushed to a GitHub repository | See Step 1 below |

---

## Step 1 — Push your project to GitHub

If the project is not yet in a GitHub repo, create one and push it.

```bash
# From the project root (wdd330finalproject/)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

> **Important:** confirm `server/.env` is listed in `.gitignore` before
> pushing.  Your real secrets must never appear in GitHub.

---

## Step 2 — Allow Render's IP in MongoDB Atlas

Render's outbound IPs change dynamically, so the easiest fix is to allow
connections from anywhere in Atlas (safe when you use a strong password).

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Open your project → **Network Access** → **+ Add IP Address**.
3. Click **Allow Access from Anywhere** (0.0.0.0/0) → **Confirm**.
4. Wait ~30 seconds for the change to apply.

---

## Step 3 — Create a Web Service on Render

1. Go to [render.com](https://render.com) and log in (or sign up — it's free).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account if prompted, then select your repository.
4. Fill in the service settings:

| Setting | Value |
|---|---|
| **Name** | `fitness-goal-tracker-api` (or any name you like) |
| **Region** | Pick the one closest to you |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

5. Click **Create Web Service** — but **do not deploy yet**.
   Scroll down to add environment variables first (Step 4).

---

## Step 4 — Set Environment Variables on Render

In the Web Service dashboard, click the **Environment** tab, then add each
variable below using **Add Environment Variable**.

| Key | Value |
|---|---|
| `MONGODB_URI` | Your full Atlas connection string (see below) |
| `JWT_SECRET` | A long random string — generate one with the command below |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Your deployed frontend URL, e.g. `https://my-app.onrender.com` (leave blank for now if you haven't deployed the frontend yet; you can add it later) |
| `NODE_ENV` | `production` |

> **Do NOT add a `PORT` variable.** Render injects it automatically.

### Getting your MongoDB Atlas connection string

1. Atlas dashboard → your cluster → **Connect** → **Connect your application**.
2. Driver: **Node.js**, Version: **5.5 or later**.
3. Copy the connection string.  It looks like:
   ```
   mongodb+srv://<username>:<password>@cse341-cluster.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=<appName>
   ```
4. Replace `<password>` with your real Atlas database user password.

### Generating a strong JWT_SECRET

Run this command locally in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output (128 hex characters) and paste it as the value.

---

## Step 5 — Deploy

After adding all environment variables, click **Save Changes** (if shown),
then click **Manual Deploy** → **Deploy latest commit** from the top of the
page.

Render will:
1. Pull your code from GitHub.
2. Run `npm install` in `server/`.
3. Run `npm start` (`node server.js`).
4. Assign your service a public URL like:
   `https://fitness-goal-tracker-api.onrender.com`

The **Logs** tab shows the startup output in real time.  A successful start
looks like:

```
─────────────────────────────────────────
  Fitness Goal Tracker API
  Server running on port 10000
  Environment: production
  Health check: http://localhost:10000/api/health
─────────────────────────────────────────
MongoDB connected: cse341-cluster.xxxxx.mongodb.net
```

---

## Step 6 — Test the live API

Open your browser (or Thunder Client) and visit:

```
https://fitness-goal-tracker-api.onrender.com/api/health
```

Expected response:

```json
{ "success": true, "message": "Server is running", "environment": "production" }
```

---

## Step 7 — Update the frontend to call the live API

Open `client/js/main.js` and change `API_BASE` to your Render URL:

```js
// Before (local dev)
const API_BASE = 'http://localhost:5000/api';

// After (production)
const API_BASE = 'https://fitness-goal-tracker-api.onrender.com/api';
```

If you want to support both environments without changing the file, you can
use a conditional based on the hostname:

```js
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://fitness-goal-tracker-api.onrender.com/api';
```

Once the frontend is deployed (Render Static Site, Netlify, GitHub Pages,
etc.), paste its URL into the `CLIENT_URL` environment variable in Render so
the API allows CORS requests from it.

---

## Step 8 — Set CLIENT_URL after deploying the frontend

1. Render dashboard → your Web Service → **Environment**.
2. Edit `CLIENT_URL` → paste the deployed frontend URL
   (e.g. `https://fitness-goal-tracker.onrender.com`).
3. Click **Save Changes** — Render will automatically redeploy the API.

---

## Automatic Redeploys

By default Render redeploys every time you push to your `main` branch.  No
extra configuration required.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Application failed to respond` | Server crashed on startup | Check the **Logs** tab for the error |
| `MongooseError: connection timed out` | Atlas IP whitelist | Add 0.0.0.0/0 in Atlas Network Access |
| `CORS blocked: https://...` | `CLIENT_URL` not set | Add the frontend URL to `CLIENT_URL` in Render env vars |
| `JsonWebTokenError: invalid signature` | `JWT_SECRET` mismatch | Make sure the same secret is used for all running instances |
| Free tier "spinning up" delay | Render free services sleep after 15 min of inactivity | Normal — first request after idle takes ~30 s |

---

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for signing/verifying JWTs |
| `JWT_EXPIRES_IN` | Yes | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Yes (prod) | CORS-allowed origin(s), comma-separated |
| `NODE_ENV` | Recommended | Set to `production` on Render |
| `PORT` | No | Render injects this automatically |
