

```markdown
# 📢 Noticeboard — Internal Broadcast System

An internal noticeboard system for broadcasting and managing real-time system announcements, maintenance windows, and policy updates. Built with a responsive React/Vite frontend and a lightweight Express backend powered by SQLite.

![Noticeboard Architecture](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Tailwind-blue)
![Backend Architecture](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20SQLite-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

---

## ✨ Features

- 📌 **Live Announcement Feed**: View real-time notices sorted by date with a dedicated visual badge for the latest broadcast.
- 🔐 **Admin Security**: Protected publishing and deletion workflows requiring admin password authorization.
- 💾 **Persistent SQL Storage**: Self-contained SQLite database engine requiring zero external database configuration.
- 🎨 **Modern Cyber-Tech UI**: Dark-mode-first aesthetic with Tailwind CSS, custom fonts, and Lucide icons.
- 🛠️ **Full TypeScript Support**: Strong end-to-end type safety across components.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

### **Backend**
- **Runtime:** Node.js
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** SQLite3
- **Tooling:** `dotenv`, `cors`, `nodemon`

---

## 📁 Project Structure

```text
noticeboard/
├── backend/
│   ├── src/
│   │   ├── db.js          # SQLite connection & table initializations
│   │   └── index.js       # Express REST API routes & middleware
│   ├── .env.example       # Backend environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── ui/
│   │   │   │       └── NoticeCard.tsx   # Individual notice card component
│   │   │   └── App.tsx                  # Main app container & feed state
│   │   ├── vite-env.d.ts                # TypeScript Vite environment definitions
│   │   └── main.tsx
│   ├── .env.example       # Frontend environment variables template
│   └── package.json
├── .gitignore
└── README.md

```

---

## 🚀 Getting Started Locally

### Prerequisites

* Node.js (v18 or higher)
* `npm` or `pnpm`

---

### 1. Backend Setup

1. Navigate to the `backend` directory:
```bash
cd backend

```


2. Install dependencies:
```bash
npm install

```


3. Create your `.env` configuration file:
```bash
cp .env.example .env

```


4. Define your port and admin authorization key in `.env`:
```env
PORT=5000
ADMIN_PASSWORD=admin

```


5. Start the backend development server:
```bash
npm run dev

```


*The server will start on `http://localhost:5000` and automatically create a `notices.db` file.*

---

### 2. Frontend Setup

1. In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend

```


2. Install dependencies:
```bash
pnpm install  # or npm install

```


3. Create your `.env` configuration file:
```bash
cp .env.example .env

```


4. Set the backend API URL in `.env`:
```env
VITE_API_URL=http://localhost:5000/api/notices

```


5. Start the Vite development server:
```bash
pnpm dev  # or npm run dev

```


6. Open `http://localhost:5173` in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Protected |
| --- | --- | --- | --- |
| `GET` | `/api/notices` | Fetch all active notices | No |
| `POST` | `/api/notices` | Create and broadcast a new notice | **Yes** (Requires `adminPass` in body) |
| `DELETE` | `/api/notices/:id` | Delete a specific notice | **Yes** (Requires `x-admin-password` header) |

---

## 🛡️ License

Authour : Tanmoy Sarkar.

```



