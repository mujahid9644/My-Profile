<div align="center">

# Mujahid Islam Portfolio

### A premium full-stack developer portfolio with animated UI, theme switching, certificates, projects, contact flow, and an AI assistant.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0b1220)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/Flask-3-111827?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=111827)](https://render.com/)

**Live Portfolio:** [my-protfolio-vt1u.onrender.com](https://my-protfolio-vt1u.onrender.com)

</div>

---

## Overview

This repository powers a modern portfolio experience for **Mujahid Islam**, built to present projects, services, certifications, technical skills, and contact options in a polished production-ready interface.

The frontend is a React + Vite application styled with Tailwind CSS and Framer Motion. The backend is a Flask service that handles the contact form, chatbot API, health checks, and production serving of the React build.

## Highlights

- Premium animated hero section with theme-aware visual assets
- Multi-theme system with persistent user preference
- Featured project carousel with interactive glass/electric cards
- Certification carousel with certificate preview and verification links
- Smooth looping skills marquee for desktop and mobile
- AI portfolio assistant with Cloudflare Workers AI and OpenRouter fallback
- Contact form powered by Gmail SMTP
- Single-service Render deployment for frontend and backend
- Responsive layout optimized for mobile, tablet, and desktop

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Framer Motion, React Icons |
| Backend | Flask, Flask-CORS, Gunicorn, Python |
| AI Assistant | Cloudflare Workers AI, OpenRouter fallback |
| Email | Gmail SMTP App Password |
| Deployment | Render, GitHub |
| Styling | CSS variables, theme tokens, responsive Tailwind utilities |

## Project Structure

```text
.
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── data/
│   │   ├── theme/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── render.yaml
└── README.md
```

## Main Sections

| Section | Purpose |
| --- | --- |
| Hero | First impression, theme-aware image, primary calls to action |
| Certifications | Slider for course certificates and verification links |
| Skills | Animated technology marquee |
| Projects | Featured project carousel with live and GitHub links |
| Services | Clear offer list for clients and collaborators |
| About | Personal and professional summary |
| Experience | Timeline-style experience section |
| Contact | Contact form, social links, and hiring CTA |
| Chatbot | AI assistant for portfolio visitors |

## Theme System

Theme presets live in:

```text
frontend/src/theme/themes.js
```

Global theme styles and shared component classes live in:

```text
frontend/src/styles.css
```

Current presets:

- Lightning Orange
- Purple Luxury
- Emerald Tech

The navbar theme switcher stores the active theme in `localStorage` using the key:

```text
portfolio-theme
```

Hero images also change by theme:

```text
Lightning Orange -> hero.jpg
Purple Luxury    -> herop.png
Emerald Tech     -> herog.png
```

## Local Development

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Create the backend virtual environment

```bash
cd ../backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Create backend environment variables

```bash
copy .env.example .env
```

Then add your real API keys and Gmail app password inside:

```text
backend/.env
```

### 4. Start the backend

```bash
cd backend
.\venv\Scripts\activate
python main.py
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

## Environment Variables

Use `backend/.env.example` as the source of truth for local backend configuration.

```env
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_MODEL=@cf/meta/llama-3.1-8b-instruct
CLOUDFLARE_TIMEOUT_SECONDS=15

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
OPENROUTER_TIMEOUT_SECONDS=15

GMAIL_EMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
SMTP_TIMEOUT_SECONDS=8

ALLOWED_ORIGINS=https://your-extra-frontend-domain.com
VITE_API_BASE_URL=
```

Never commit real `.env` files or production secrets.

## Available Scripts

Run these from the `frontend` folder:

```bash
npm run dev
npm run build
npm run preview
```

Run the backend from the `backend` folder:

```bash
python main.py
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Backend health check |
| POST | `/api/chat` | AI assistant response endpoint |
| POST | `/api/contact` | Contact form email endpoint |

### Health Check

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "backend",
  "timestamp": "2026-05-23T00:00:00+00:00"
}
```

## Production Deployment

This project is configured for a single Render web service through:

```text
render.yaml
```

Render build command:

```bash
npm ci && npm run build && pip install -r backend/requirements.txt
```

Render start command:

```bash
cd backend && gunicorn main:app --bind 0.0.0.0:$PORT
```

Health check path:

```text
/health
```

When deployed, Flask serves the generated React `dist/` build and falls back to `index.html` for SPA routes.

## Customization Guide

### Update Projects

Project data lives in:

```text
frontend/src/data/skills.js
```

Edit the `projects` array to update titles, descriptions, images, tech stacks, live links, and GitHub links.

### Update Certifications

Certification data lives in:

```text
frontend/src/components/Certifications.jsx
```

Edit the `certifications` array to change certificate names, issuers, images, and verification URLs.

### Update Skills

The visual skills marquee lives in:

```text
frontend/src/components/Skills.jsx
```

Shared marquee styling lives in:

```text
frontend/src/styles.css
```

### Update Contact Links

Navbar and social contact links live mainly in:

```text
frontend/src/components/Navbar.jsx
frontend/src/components/ui/FloatingSocials.jsx
```

## Quality Checks

Before pushing changes, run:

```bash
cd frontend
npm run build
```

For backend validation:

```bash
cd backend
python main.py
```

Then test:

```bash
curl http://127.0.0.1:8000/health
```

## Repository Notes

- The frontend is located inside `frontend/`.
- The backend is located inside `backend/`.
- Production build output is generated into `dist/`.
- Real credentials should stay in `backend/.env` and Render environment variables only.
- The project is designed to be easy to update section by section without rewriting the whole app.

## Author

**Mujahid Islam**  
Full-stack developer focused on modern web apps, AI-powered interfaces, automation workflows, and polished portfolio experiences.

<div align="center">

**Built with React, Flask, Tailwind CSS, and a lot of care for the user experience.**

</div>
