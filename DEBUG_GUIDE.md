# Chatbot Debug Guide

## Complete Setup Checklist

### Backend Setup

- [ ] Python 3.8+ installed
- [ ] `.env` file created in `backend/` folder
- [ ] Valid Gemini API key added (or at least OpenRouter key)
- [ ] Backend dependencies installed: `pip install -r requirements.txt`
- [ ] Backend starts without errors: `python main.py`
- [ ] Health endpoint responds: `curl http://127.0.0.1:8000/health`
- [ ] Chat endpoint responds: Test via PowerShell (see README)

### Frontend Setup

- [ ] Node.js 16+ installed
- [ ] Frontend dependencies installed: `npm install`
- [ ] Frontend builds: `npm run build`
- [ ] Frontend dev server runs: `npm run dev`
- [ ] Chatbot button appears on page
- [ ] Chatbot opens when clicked
- [ ] Message can be typed and sent
- [ ] AI response appears in chat

### Integration Check

- [ ] Backend running on `http://127.0.0.1:8000`
- [ ] Frontend running on `http://127.0.0.1:5173` (or similar)
- [ ] No CORS errors in browser console
- [ ] No network errors in DevTools Network tab
- [ ] Backend logs show incoming messages
- [ ] Backend logs show successful responses
- [ ] Chat messages display in correct order
- [ ] Chat status shows correct AI provider

## How Chatbot Works (Data Flow)

```
Frontend (React)
    ↓
User types message in chatbot input
    ↓
Click "Send" button
    ↓
POST request to http://127.0.0.1:8000/api/chat
    {
      "message": "user message"
    }
    ↓
Backend (Flask)
    ↓
Receives POST request
    ↓
Logs: "Received chat message (length: X chars)"
    ↓
Call AI provider (Gemini or OpenRouter)
    ↓
Get response from AI
    ↓
Return JSON response:
    {
      "reply": "AI response",
      "key_in_use": "provider name",
      "status": "success"
    }
    ↓
Frontend receives response
    ↓
Parse JSON
    ↓
Add to messages list
    ↓
Display in chat UI
    ↓
Update status: "Using [provider name]"
    ↓
Enable input for next message
```

## Step-by-Step Debugging Process

### 1. Verify Backend

```bash
# Check if running
curl http://127.0.0.1:8000/health

# Expected: 200 OK with JSON response

# Check logs
# Watch the backend terminal for:
# - INFO:werkzeug: GET /health HTTP/1.1" 200
# - SUCCESS means backend is running
```

### 2. Verify Frontend

```bash
# Check if running
# Visit http://127.0.0.1:5173 (or 5174, 5175, etc.)
# Should see portfolio website

# Open DevTools
# F12 → Console tab

# Should be empty (no red errors)
```

### 3. Test API Connection

```bash
# In DevTools Console, paste:
fetch('http://127.0.0.1:8000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'test' })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err))

# Expected in console:
# {reply: "...", key_in_use: "...", status: "success"}

# If CORS error: Backend CORS config needs update
# If 404: Backend not running
# If timeout: Check API keys
```

### 4. Send Chatbot Message

```
1. Click chatbot button (bottom right)
2. Type: "hello"
3. Click send
4. Watch DevTools Network tab
5. Look for POST to /api/chat
6. Check response
7. Should see reply in chat UI
```

### 5. Read Backend Logs

While chatbot message is processing, watch backend terminal:

```
INFO:__main__:Received chat message (length: 5 chars)
INFO:__main__:Chat response generated successfully using OpenRouter openrouter/free
INFO:werkzeug:127.0.0.1 - - [30/Apr/2026 00:25:47] "POST /api/chat HTTP/1.1" 200
```

This means: ✅ Message received → ✅ AI responded → ✅ Sent back to frontend

## Common Issues & Instant Fixes

### Issue: CORS Error in Console

**Error:**
```
Access to fetch at 'http://127.0.0.1:8000/api/chat' from origin 'http://127.0.0.1:5175'
has been blocked by CORS policy
```

**Fix:** 
1. Note your frontend port (5175 in example)
2. Edit `backend/main.py` line 48-66
3. Add your port to ALLOWED_ORIGINS list
4. Restart backend: `python main.py`

### Issue: "Offline" Status in Chatbot

**Fix:**
1. Check backend running: `curl http://127.0.0.1:8000/health`
2. Check frontend console for errors: F12
3. Check CORS (see above)
4. Restart both: backend and frontend

### Issue: Message Won't Send (Button Disabled)

**Check:**
1. DevTools Network tab - any requests being made?
2. DevTools Console - any errors?
3. Backend logs - any messages received?
4. If nothing: Backend not running

### Issue: Backend Returns Error 503

**Error in Chat:**
```
"AI service temporarily unavailable"
```

**Fix:**
1. Check `.env` has valid API keys
2. Check internet connection
3. Try waiting (API might be rate limited)
4. Check AI provider status page:
   - https://status.cloud.google.com/ (Gemini)
   - https://status.openrouter.ai/ (OpenRouter)

### Issue: "Message is required" Error (400)

**Fix:**
1. Try typing something before sending
2. Check if input field is focused
3. Try refreshing page
4. Check frontend code isn't modified

## Files to Check When Debugging

- **Backend API logic:** `backend/main.py` (lines 205-245)
- **CORS config:** `backend/main.py` (lines 48-66)
- **Frontend API URL:** `frontend/src/config/api.js`
- **Chatbot component:** `frontend/src/components/Chatbot.jsx`
- **Backend environment:** `backend/.env`
- **Frontend logs:** Browser DevTools Console (F12)
- **Backend logs:** Terminal where you ran `python main.py`

## Testing Checklist

### Basic Connectivity
- [ ] Backend health endpoint works
- [ ] Backend API endpoint responds
- [ ] No CORS errors in browser
- [ ] Network request appears in DevTools

### Message Flow
- [ ] Can open chatbot
- [ ] Can type in input
- [ ] Can click send
- [ ] Message appears in chat
- [ ] Status shows "Thinking..."
- [ ] Response appears in chat
- [ ] Status shows provider name

### Error Handling
- [ ] Invalid message (empty) shows error
- [ ] API failure shows user-friendly message
- [ ] Network error handled gracefully
- [ ] Rate limit doesn't crash app

### Persistence
- [ ] Messages stay in chat when scrolling
- [ ] Chat works multiple times
- [ ] No memory leaks (no performance degradation)
- [ ] Page refresh resets chat (normal behavior)

## Advanced Debugging

### Enable Verbose Backend Logging

Edit `backend/main.py` line 20:
```python
logging.basicConfig(level=logging.DEBUG)  # More detailed logs
```

### Check CORS Headers

In DevTools Network tab, click `/api/chat` request:
- Scroll to Response Headers
- Look for: `Access-Control-Allow-Origin: http://127.0.0.1:5175`
- If missing: CORS not configured

### Monitor API Rate Limiting

Backend enforces 1-second delay between messages.
If you send too fast, you'll get 429 error.
Wait 1 second between messages.

### Check Memory Usage

Long chat sessions with many messages might slow down.
Frontend doesn't clear old messages (stored in state).
Page refresh clears chat memory.

## Production Debugging (Render)

### Health Check
```bash
curl https://my-protfolio-vt1u.onrender.com/health
```

### Chat Test
```bash
curl -X POST https://my-protfolio-vt1u.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

### Check Render Logs
1. Go to https://dashboard.render.com
2. Select your service
3. Go to "Logs" tab
4. Watch for errors

### Common Production Issues

**Issue:** Works locally but not on Render
- Check `.env` variables in Render dashboard
- Check Render deployment logs
- Make sure Flask is serving the React build

**Issue:** API timeout on Render  
- Check Render log for AI provider timeout
- May need to increase timeout in `.env`

**Issue:** 502 Bad Gateway
- Backend crashed - check logs
- Restart service from Render dashboard
