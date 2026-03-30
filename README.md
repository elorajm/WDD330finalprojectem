# Fitness Goal Tracker

A full-stack fitness web app built for WDD330. Users register, log workouts, track body measurements, view progress charts, and customize a personal avatar that levels up as they hit workout milestones.

---

## Features

- **User Authentication** — register and log in with a JWT-protected account
- **Dashboard** — at-a-glance streak, calories burned, and recent activity
- **Workout Logger** — log any workout with type, duration, calories, and notes; edit or delete past entries
- **Body Metrics** — track weight, height, BMI, and other measurements over time
- **Progress Charts** — interactive Chart.js graphs for weight, weekly workouts, and active minutes
- **Avatar Coach** — customizable SVG avatar (skin, hair, outfit, accessories) that progresses through Beginner → Intermediate → Advanced stages based on total workouts
- **Dark Mode** — toggle-able theme persisted in `localStorage`
- **Mobile Responsive** — hamburger nav and fluid grid layout

---

## Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | Vanilla HTML / CSS / JavaScript (no framework) |
| Charts     | Chart.js 4                                    |
| Backend    | Node.js + Express                             |
| Database   | MongoDB (via Mongoose)                        |
| Auth       | JSON Web Tokens (JWT) + bcryptjs password hashing |
| Deployment | Render (single Express process serves everything) |

---

## Folder Structure

```
wdd330finalproject/
├── client/                   # Static frontend (served by Express)
│   ├── index.html            # Login / register page
│   ├── dashboard.html        # Main dashboard
│   ├── workout.html          # Log and manage workouts
│   ├── metrics.html          # Body measurements
│   ├── progress.html         # Progress charts + workout history
│   ├── avatar.html           # Avatar customization
│   ├── css/
│   │   └── styles.css        # Global stylesheet (variables, components)
│   └── js/
│       └── main.js           # Shared utilities: Auth, Theme, toasts, helpers
│
└── server/                   # Express API
    ├── server.js             # App entry point
    ├── .env                  # Environment variables (never committed)
    ├── config/
    │   └── db.js             # MongoDB connection
    ├── middleware/
    │   ├── protect.js        # JWT verification middleware
    │   └── errorHandler.js   # Global error handler
    ├── models/
    │   ├── User.js           # Mongoose user schema
    │   ├── Workout.js        # Mongoose workout schema
    │   └── Metric.js         # Mongoose body-metrics schema
    ├── routes/
    │   ├── auth.js           # POST /api/auth/register, /api/auth/login
    │   ├── users.js          # GET/PUT /api/users/profile
    │   ├── workouts.js       # CRUD  /api/workouts
    │   ├── metrics.js        # CRUD  /api/metrics
    │   ├── progress.js       # GET   /api/progress
    │   ├── suggestions.js    # GET   /api/suggestions
    │   └── health.js         # GET   /api/health
    └── utils/
        ├── calcAvatarStage.js  # Workout count → stage name
        └── calcStreak.js       # Array of dates → current streak
```

---

## Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account (or a local MongoDB installation)

### Steps

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd wdd330finalproject
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Create the environment file**

   Create `server/.env` with the following variables:

   ```
   MONGODB_URI=<your MongoDB connection string>
   JWT_SECRET=<any long random string>
   NODE_ENV=development
   CLIENT_URL=http://localhost:5000
   ```

   > **Tip:** Generate a strong JWT secret by running `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` in your terminal.

4. **Start the development server**

   ```bash
   # from inside the server/ folder
   npm run dev
   ```

   The server starts on **http://localhost:5000**. Open that URL in your browser — Express serves the `client/` folder automatically, so no separate frontend server is needed.

---

## MongoDB Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free cluster.
2. Under **Database Access**, add a user with _Read and write to any database_ privileges.
3. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) while developing, or your specific IP.
4. Click **Connect → Drivers** and copy the connection string. Replace `<password>` with your database user's password.
5. Paste that string as `MONGODB_URI` in your `server/.env` file.

Mongoose will create collections automatically the first time you register a user — no manual schema setup required.

---

## How Authentication Works

1. **Register** — the client POSTs `{ name, email, password }` to `/api/auth/register`. The server hashes the password with bcryptjs, saves the user in MongoDB, and returns a signed JWT.
2. **Log in** — same flow, but the server looks up the user and validates the password hash.
3. **Protected routes** — the `protect` middleware verifies the JWT on every request to `/api/workouts`, `/api/metrics`, etc. If the token is missing or invalid, the server responds with `401 Unauthorized`.
4. **Client side** — `main.js` stores the token in `localStorage` under `fgt_token`. The `Auth.getHeaders()` helper attaches it as `Authorization: Bearer <token>` on every API call. `requireAuth()` is called at the top of every protected page — if no token is stored, the user is redirected to the login page.

---

## Deploying to Render

Render can serve both the API and the frontend from a single Web Service because Express serves `client/` as static files.

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) and create a new **Web Service** pointing at your repo.
3. Set the following:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in Render's dashboard:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — your secret key
   - `NODE_ENV` — `production`
   - `CLIENT_URL` — your Render app's URL (e.g. `https://your-app.onrender.com`)
5. Deploy. Render will hand you a public URL — that's it!

> The free Render tier spins down after 15 minutes of inactivity, so the first request after a cold start will be slow. This is normal.

---

## API Endpoints Quick Reference

| Method | Endpoint                   | Auth? | Description                     |
|--------|----------------------------|-------|---------------------------------|
| GET    | `/api/health`              | No    | Server health check             |
| POST   | `/api/auth/register`       | No    | Create a new account            |
| POST   | `/api/auth/login`          | No    | Log in, receive JWT             |
| GET    | `/api/users/profile`       | Yes   | Get logged-in user's profile    |
| PUT    | `/api/users/profile`       | Yes   | Update profile / avatar config  |
| GET    | `/api/workouts`            | Yes   | List all user's workouts        |
| POST   | `/api/workouts`            | Yes   | Log a new workout               |
| PUT    | `/api/workouts/:id`        | Yes   | Update a workout                |
| DELETE | `/api/workouts/:id`        | Yes   | Delete a workout                |
| GET    | `/api/metrics`             | Yes   | List body-metric entries        |
| POST   | `/api/metrics`             | Yes   | Log a new measurement           |
| DELETE | `/api/metrics/:id`         | Yes   | Delete a measurement            |
| GET    | `/api/progress?days=30`    | Yes   | Chart data + workout history    |
| GET    | `/api/suggestions`         | Yes   | Personalised workout suggestions|

---

## Course Info

WDD 330 — Web Frontend Development II
Fitness Goal Tracker — Final Project, 2025
