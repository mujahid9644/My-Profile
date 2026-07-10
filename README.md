# Mujahid Islam Portfolio

React + Vite + Tailwind CSS portfolio with a Flask backend for contact form and chatbot APIs. The production Render deployment serves the React build and backend from one web service.

Current Render service:

```text
https://my-protfolio-vt1u.onrender.com
```

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Icons
- Backend: Flask, Flask-CORS, Gunicorn
- AI: Gemini primary, OpenRouter fallback
- Email: Gmail SMTP app password

## Theme System

The portfolio uses CSS variables in `frontend/src/styles.css` and preset tokens in `frontend/src/theme/themes.js`.

Preset themes:

- Cyber Blue
- Purple Luxury
- Emerald Tech

To change the whole site palette, edit the variables for the active theme only:

- `--bg-primary`
- `--bg-secondary`
- `--text-primary`
- `--text-muted`
- `--accent-primary`
- `--accent-secondary`
- `--card-bg`
- `--card-border`
- `--glow-color`

The theme switcher in the navbar saves the selected theme to localStorage under `portfolio-theme`.

## Local Setup

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create local backend env:

```bash
copy .env.example backend\.env
```

Start backend:

```bash
cd backend
.\venv\Scripts\activate
python main.py
```

Start frontend:

```bash
npm run dev
```

Local URLs:

```text
Frontend: http://127.0.0.1:5173
Backend:  http://127.0.0.1:8000
Health:   http://127.0.0.1:8000/health
```

## Render Deployment

This repo includes `render.yaml` for a single Render web service.

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

After pushing to the `main` branch, Render auto deploys if Auto Deploy is enabled for the service.

## Required Render Environment Variables

Add these in Render Dashboard > Service > Environment:

```env
GEMINI_API_KEY_1=your_gemini_primary_key
GEMINI_API_KEY_2=
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_MAX_OUTPUT_TOKENS=180

OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/free
OPENROUTER_TIMEOUT_SECONDS=20

GMAIL_EMAIL=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_character_google_app_password
SMTP_TIMEOUT_SECONDS=8
```

Optional:

```env
ALLOWED_ORIGINS=https://extra-domain.com
VITE_API_BASE_URL=
```

Leave `VITE_API_BASE_URL` empty on Render. The deployed React app calls same-origin `/api/chat` and `/api/contact`.

## Production Build

```bash
npm run build
```

The output is generated in `dist/`. Flask serves `dist/index.html` and falls back to it for SPA refresh routes.

## Configuration Guide

### Section Order

The portfolio section order is controlled in `frontend/src/App.jsx`. Current order:

```jsx
<main>
  <Hero />
  <Skills />
  <Projects />
  <Services />
  <About />
  <Experience />
  <Contact />
</main>
```

To reorder, simply move the component imports and their rendering order in the `<main>` tag.

**File:** `frontend/src/App.jsx` (lines 44-53)

### Theme Colors

All theme colors use CSS variables and are centralized in two files:

#### 1. **CSS Variables** (for active theme)
**File:** `frontend/src/styles.css` (lines 1-40)

Edit the `:root` CSS variables to customize default theme colors:
```css
--bg-primary: #030910;
--bg-secondary: #0f1419;
--text-primary: #edc0b4;
--text-muted: #9ca3af;
--accent-primary: #06b6d4;
--accent-secondary: #7c8dff;
--card-bg: rgba(255, 255, 255, 0.06);
--card-border: rgba(255, 255, 255, 0.1);
--glow-color: 34, 197, 94;
```

#### 2. **Theme Presets**
**File:** `frontend/src/theme/themes.js`

Modify or add new theme presets with complete color palettes:
```javascript
export const themes = [
  {
    id: 'cyber-blue',
    name: 'Cyber Blue',
    description: 'Modern cyan and blue',
    tokens: {
      '--bg-primary': '#030910',
      '--accent-primary': '#06b6d4',
      // ... all other tokens
    }
  },
  // ... more themes
];
```

**Theme Switcher:** Users can switch themes via the navbar dropdown. Selection is saved to localStorage.

### WhatsApp Button Configuration

The WhatsApp button appears in both desktop and mobile navbar.

**File:** `frontend/src/components/Navbar.jsx`

Change the WhatsApp link URL (line 34 desktop, line 65 mobile):
```jsx
<a href="https://wa.me/8801533827434" target="_blank" rel="noreferrer">
```

Replace `8801533827434` with your WhatsApp number (without + or spaces, international format).

Button styling uses green glow:
```jsx
className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-2 font-semibold text-green-400 transition-all hover:border-green-400 hover:bg-green-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
```

### Skills & Technology Icons

Skills are displayed in a responsive grid in the Skills section.

**File:** `frontend/src/data/skills.js` (lines 1-48)

Edit the `skills` array to add, remove, or change skill icons:
```javascript
export const skills = [
  { name: 'HTML', icon: FaHtml5 },
  { name: 'CSS', icon: FaCss3Alt },
  { name: 'JavaScript', icon: FaJs },
  { name: 'React', icon: FaReact },
  // ... more skills
];
```

Available icon libraries:
- `react-icons/fa` - Font Awesome icons
- `react-icons/si` - Simple Icons
- `react-icons/tb` - Tabler icons
- `react-icons/lu` - Lucide icons

Import new icons at the top of the file and add them to the skills array.

### Project Icons & Details

Projects display with type icons and expandable detail panels.

**File:** `frontend/src/data/skills.js` (lines 50-122)

Edit the `projects` array to modify project details:
```javascript
export const projects = [
  {
    title: 'AI SalesBot SaaS',
    description: 'A SaaS concept for AI-assisted sales...',
    icon: TbRobot,  // Project type icon
    stack: ['Django', 'React', ...],
    features: ['Lead capture workflows', ...],
    challenges: ['Keeping response latency low', ...],
    liveUrl: '#contact',
    githubUrl: 'https://github.com/...',
  },
  // ... more projects
];
```

Each project must have:
- `title`: Project name
- `description`: Short description
- `icon`: React Icon component
- `stack`: Array of technologies used
- `features`: Array of key features (3-4 items)
- `challenges`: Array of challenges overcome (2-3 items)
- `liveUrl`: Link to live demo
- `githubUrl`: Link to GitHub repository

### Services Section Icons

Services are displayed with icons in a grid layout.

**File:** `frontend/src/components/Services.jsx` (lines 6-30)

The services array includes icons imported from React Icons:
```javascript
const services = [
  {
    title: 'AI Chatbots & LLM Integration',
    description: 'Conversation flows, RAG pipelines...',
    icon: FaRobot,
  },
  // ... more services
];
```

To change service icons, import different icons and update the `icon` property.

### Hero Section Text

The Hero section displays main headline and description.

**File:** `frontend/src/components/Hero.jsx` (lines 20-28)

Update the main title:
```jsx
<h1 className="...">
  AI + Full Stack
  <span className="gradient-text block">Developer</span>
</h1>
```

Update the description:
```jsx
<p className="...">
  I build AI-powered websites, SaaS dashboards, chatbots and automation systems for real businesses.
</p>
```

### Chatbot Configuration

The AI chatbot can be customized via backend API response.

**File:** `frontend/src/components/Chatbot.jsx`

- Initial message (line 16): "Hi! I'm Mujahid's AI Assistant..."
- Placeholder text (line 126): "Ask me something..."
- Status messages (lines 50-62): Connected, Thinking, Offline, Error

Backend API endpoint: `POST /api/chat` (see `backend/main.py`)

### Navbar Menu Links

The navbar displays navigation links in desktop and mobile layouts.

**File:** `frontend/src/components/Navbar.jsx` (lines 8-15)

Edit the `navLinks` array:
```javascript
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];
```

Links should correspond to section `id` attributes.

## Health Check

```bash
curl https://my-protfolio-vt1u.onrender.com/health
```

## Debugging & Troubleshooting

### Backend Issues

#### 1. Backend Server Won't Start

**Problem:** `python main.py` fails or port 8000 is already in use

**Solution:**
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process using the port (on Windows)
taskkill /PID <PID> /F

# Or use a different port (modify Procfile and main.py)
```

#### 2. "No AI Provider Key Configured" Error

**Problem:** Chatbot returns "Service not configured" error

**Solution:**
1. Create `.env` in backend folder (copy from `.env.example`)
2. Add valid API keys:
   ```
   GEMINI_API_KEY_1=your_actual_gemini_key
   OPENROUTER_API_KEY=your_actual_openrouter_key
   ```
3. Restart backend: `python main.py`

Get keys at:
- **Gemini:** https://makersuite.google.com/app/apikey
- **OpenRouter:** https://openrouter.ai/keys

#### 3. "Invalid API Key" Error

**Problem:** Backend logs show: `400 API key not valid`

**Solution:**
- Verify API key format is correct (no extra spaces)
- For Gemini: Key should start with `AIza...`
- For OpenRouter: Key should start with `sk-or-v1-...`
- Test key in the provider's dashboard

#### 4. Chat Endpoint Returns 503 (Service Unavailable)

**Problem:** Both AI providers fail simultaneously

**Solutions:**
1. Verify both API keys are configured in `.env`
2. Check internet connection
3. Check provider status pages:
   - Gemini: https://status.cloud.google.com/
   - OpenRouter: https://status.openrouter.ai/

### Frontend Issues

#### 1. CORS Error: "Response to preflight request doesn't pass access control check"

**Problem:**
```
Access to fetch at 'http://127.0.0.1:8000/api/chat' from origin 'http://127.0.0.1:5175' 
has been blocked by CORS policy
```

**Solution:**
Verify backend CORS configuration in [backend/main.py](backend/main.py#L48-L66) includes your frontend port:
```python
ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",  # Default Vite port
    "http://127.0.0.1:5174",  # Fallback 1
    "http://127.0.0.1:5175",  # Fallback 2
    "http://127.0.0.1:5176",  # Fallback 3
    # ... add your port if different
]
```

After editing, restart backend: `python main.py`

#### 2. Chatbot Shows "Offline" Status

**Problem:** Status shows "Offline" instead of "Online"

**Solutions:**
1. Check backend is running: `curl http://127.0.0.1:8000/health`
2. Verify frontend port matches CORS configuration
3. Check browser console for error messages (F12)
4. Restart frontend: `npm run dev`

#### 3. Chat Messages Don't Send

**Problem:** Message input disabled, no response

**Solutions:**
1. Check browser console (F12 → Console tab) for errors
2. Check Network tab to see if POST request is being made
3. If 404 error: Backend not running or wrong URL
4. If 500 error: Check backend terminal for error message
5. If timeout: Backend AI provider is slow, wait for response

#### 4. API_BASE_URL Not Working

**Problem:** Frontend can't connect to backend

**Cause:** Incorrect API URL configuration

**Solutions:**

For **development (localhost)**:
```javascript
// frontend/src/config/api.js automatically uses:
// http://127.0.0.1:8000 (if running on localhost/127.0.0.1)
```

For **production (Render)**:
```javascript
// Same origin - no explicit URL needed
// React build calls /api/chat (Flask handles routing)
```

To override, create `.env` in frontend folder:
```
VITE_API_BASE_URL=http://custom-backend-url.com
```

Then restart frontend: `npm run dev`

### Browser Developer Tools

#### View API Requests

1. Open browser DevTools: **F12**
2. Go to **Network** tab
3. Send a chatbot message
4. Look for POST request to `/api/chat`
5. Click request to see:
   - **Headers:** Request/response headers (check CORS headers)
   - **Request:** Payload sent to backend
   - **Response:** AI reply received

#### Check Console Errors

1. Open DevTools: **F12**
2. Go to **Console** tab
3. Send a chatbot message
4. Check for red errors

Common errors:
- `CORS error` → See CORS solution above
- `Failed to fetch` → Backend not running
- `TypeError: Cannot read property 'reply'` → Backend response format wrong

### Backend Terminal Logs

When debugging, watch backend terminal for logs:

```
INFO:__main__:Received chat message (length: X chars)        ← Message received
INFO:__main__:Chat response generated successfully using...   ← AI response ready
INFO:werkzeug:127.0.0.1 - - "POST /api/chat HTTP/1.1" 200   ← Success (200)
ERROR:__main__:OpenRouter returned no message content         ← API provider error
```

## Common Setup Issues & Fixes

### Issue: Chatbot doesn't work after fresh clone

```bash
# 1. Install dependencies
npm install
cd backend && pip install -r requirements.txt && cd ..

# 2. Create .env file with valid API keys
cp backend/.env.example backend/.env
# Edit backend/.env and add real API keys

# 3. Start both servers
# Terminal 1:
python backend/main.py

# Terminal 2:
npm run dev

# 4. Test health
curl http://127.0.0.1:8000/health
```

### Issue: "Port already in use"

```bash
# Find process using port (Windows)
netstat -ano | findstr :8000

# Kill it
taskkill /PID 12345 /F

# Or use different port:
# Change in backend/Procfile or main.py
```

### Issue: Gmail contact form not sending

**Problem:** Contact form works but no email arrives

**Solutions:**
1. Verify Gmail credentials in `.env`:
   ```
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_APP_PASSWORD=16-character-app-password
   ```
2. Generate app password:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Create App Password (Mail app)
   - Use 16-character password (no spaces)

3. Check backend logs for error

## Quick Test Commands

### Test Health Endpoint

```bash
curl http://127.0.0.1:8000/health
```

Expected response:
```json
{"status": "ok", "service": "portfolio", "timestamp": "..."}
```

### Test Chat Endpoint

```bash
# PowerShell (Windows)
$body = @{message = "hello"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/chat" -Method POST `
  -Headers @{"Content-Type"="application/json"} -Body $body

# Bash (Linux/Mac)
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

Expected response:
```json
{
  "reply": "Hi! How can I help...",
  "key_in_use": "OpenRouter openrouter/free",
  "status": "success"
}
```

### Test Contact Form

```bash
# PowerShell (Windows)
$body = @{
  name = "Test User"
  email = "test@example.com"
  subject = "Test"
  message = "Test message"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/contact" -Method POST `
  -Headers @{"Content-Type"="application/json"} -Body $body
```

Expected response:
```json
{"status": "success"}
```

## Environment Variables Reference

### Backend (.env file)

```bash
# Gemini API Configuration
GEMINI_API_KEY_1=your_primary_gemini_key          # Required for AI responses
GEMINI_API_KEY_2=                                 # Optional fallback
GEMINI_MODEL=gemini-2.5-flash-lite                # Model name
GEMINI_MAX_OUTPUT_TOKENS=180                      # Response length limit

# OpenRouter Configuration (Fallback AI Provider)
OPENROUTER_API_KEY=your_openrouter_key            # Required if Gemini fails
OPENROUTER_MODEL=openrouter/free                  # Free model name
OPENROUTER_TIMEOUT_SECONDS=20                     # Request timeout

# Gmail Configuration (for Contact Form)
GMAIL_EMAIL=your-email@gmail.com                  # Gmail address
GMAIL_APP_PASSWORD=16-char-app-password           # 16-character app password
SMTP_TIMEOUT_SECONDS=8                            # Email send timeout

# CORS Configuration (Development)
ALLOWED_ORIGINS=https://extra-domain.com          # Additional frontend domains

# Rate Limiting (Optional)
RATE_LIMIT_PER_MINUTE=60
MAX_TOKENS_PER_REQUEST=1000
```

### Frontend (.env file - optional)

```bash
# Override backend URL (only needed if not localhost)
VITE_API_BASE_URL=http://custom-backend-url.com
```

## Backend API Endpoints

### GET `/health`

Health check endpoint

**Request:**
```bash
GET http://127.0.0.1:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "portfolio",
  "timestamp": "2026-04-29T18:21:33.746192+00:00"
}
```

### POST `/api/chat`

AI chatbot endpoint

**Request:**
```bash
POST http://127.0.0.1:8000/api/chat
Content-Type: application/json

{
  "message": "Your question here"
}
```

**Response (Success):**
```json
{
  "reply": "AI response here...",
  "key_in_use": "OpenRouter openrouter/free",
  "status": "success"
}
```

**Response (Error):**
```json
{
  "error": "AI service temporarily unavailable"
}
```

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Missing message field
- `429 Too Many Requests` - Rate limit exceeded
- `503 Service Unavailable` - No AI provider available

### POST `/api/contact`

Contact form endpoint

**Request:**
```bash
POST http://127.0.0.1:8000/api/contact
Content-Type: application/json

{
  "name": "Your Name",
  "email": "your-email@example.com",
  "subject": "Subject",
  "message": "Message body"
}
```

**Response:**
```json
{
  "status": "success"
}
```
```

Expected response:

```json
{
  "status": "ok",
  "service": "portfolio",
  "timestamp": "..."
}
```

## Troubleshooting

- If Render build fails at `npm ci`, make sure `package-lock.json` is committed.
- If chatbot fails in production, verify `GEMINI_API_KEY_1` or `OPENROUTER_API_KEY` is set in Render.
- If contact form fails, verify Gmail 2-Step Verification and a 16-character app password.
- If page refresh returns 404, ensure the Flask backend is serving the React `dist/` build and `render.yaml` uses the provided start command.
- If browser CORS blocks local dev, use `http://127.0.0.1:5173` for frontend and `http://127.0.0.1:8000` for backend.

# My-Profile
