from flask import Flask, request, jsonify, send_from_directory, g
from flask_cors import CORS
import os
from datetime import datetime, timezone
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
import logging
from smtplib import SMTPAuthenticationError, SMTPException
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# Configure chatbot AI provider
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
CLOUDFLARE_MODEL = os.getenv("CLOUDFLARE_MODEL", "@cf/meta/llama-3.1-8b-instruct")
CLOUDFLARE_TIMEOUT_SECONDS = int(os.getenv("CLOUDFLARE_TIMEOUT_SECONDS", "15"))
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")
OPENROUTER_TIMEOUT_SECONDS = int(os.getenv("OPENROUTER_TIMEOUT_SECONDS", "15"))
CHATBOT_FALLBACK_REPLY = "Sorry, I\u2019m having trouble responding right now. Please try again shortly."
GMAIL_EMAIL = os.getenv("GMAIL_EMAIL")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
SMTP_TIMEOUT_SECONDS = int(os.getenv("SMTP_TIMEOUT_SECONDS", "8"))
MAX_JSON_BYTES = int(os.getenv("MAX_JSON_BYTES", "32768"))
CHATBOT_TEMPERATURE = float(os.getenv("CHATBOT_TEMPERATURE", "0.2"))
CHATBOT_MAX_TOKENS = int(os.getenv("CHATBOT_MAX_TOKENS", "450"))

# Initialize Flask with production configuration
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
app = Flask(__name__, static_folder=None)
app.static_folder = FRONTEND_DIST
app.config['JSON_SORT_KEYS'] = False
app.config['PROPAGATE_EXCEPTIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = MAX_JSON_BYTES

# Configure CORS for security
ALLOWED_ORIGINS = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://my-protfolio-vt1u.onrender.com",
    "https://my-profile-pi-navy.vercel.app",
    "https://mujahid9644.github.io",
    "https://mujahid9644.github.io/my_protfolio"
]
extra_origins = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS.extend([origin.strip() for origin in extra_origins.split(",") if origin.strip()])

CORS(app, resources={
    r"/api/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["POST", "GET", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": False,
        "max_age": 600  # Cache preflight requests for 10 minutes
    },
    r"/health": {
        "origins": "*",
        "methods": ["GET", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "max_age": 600
    },
    r"/": {
        "origins": "*",
        "methods": ["GET", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "max_age": 600
    }
})

@app.before_request
def log_request_start():
    g.request_started_at = time.monotonic()

@app.after_request
def log_request_end(response):
    if request.path in {"/health"}:
        return response

    duration_ms = int((time.monotonic() - g.get("request_started_at", time.monotonic())) * 1000)
    logger.info("%s %s -> %s (%sms)", request.method, request.path, response.status_code, duration_ms)
    return response

@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(405)
def handle_method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(Exception)
def handle_unexpected_error(error):
    logger.exception("Unhandled backend error")
    return jsonify({"error": "Internal server error"}), 500

@app.route("/health", methods=["GET"])
def health_endpoint():
    return jsonify({
        "status": "ok",
        "service": "backend",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route("/", methods=["GET"])
def root_endpoint():
    return "Backend is running", 200, {"Content-Type": "text/plain; charset=utf-8"}

if CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN:
    logger.info(f"Configured Cloudflare Workers AI model: {CLOUDFLARE_MODEL}")
else:
    logger.error("Cloudflare Workers AI is not configured")
if OPENROUTER_API_KEY:
    logger.info(f"Configured OpenRouter fallback model: {OPENROUTER_MODEL}")

def validate_email_data(data):
    if not data:
        return False, "Request body is required"
    required_fields = ['name', 'email', 'subject', 'message']
    if not all(field in data for field in required_fields):
        return False, "Missing required fields"
    if not all(data[field].strip() for field in required_fields):
        return False, "All fields must be non-empty"
    return True, None

def send_email(contact_data):
    if not all([GMAIL_EMAIL, GMAIL_APP_PASSWORD]):
        logger.error("Email configuration missing")
        return jsonify({"error": "Email service not configured"}), 503
    if len(GMAIL_APP_PASSWORD.replace(" ", "")) != 16:
        logger.error("Gmail app password must be a 16-character app password")
        return jsonify({
            "error": "Gmail app password is invalid. Use a 16-character Google App Password."
        }), 503
    
    # Validate email data
    is_valid, error_message = validate_email_data(contact_data)
    if not is_valid:
        return jsonify({"error": error_message}), 400
    
    msg = MIMEMultipart()
    msg['From'] = GMAIL_EMAIL
    msg['To'] = GMAIL_EMAIL
    msg['Subject'] = f"Portfolio Contact: {contact_data['subject']}"
    
    body = f"""
    New contact from portfolio website:
    
    Name: {contact_data['name']}
    Email: {contact_data['email']}
    Subject: {contact_data['subject']}
    
    Message:
    {contact_data['message']}
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        with smtplib.SMTP('smtp.gmail.com', 587, timeout=SMTP_TIMEOUT_SECONDS) as server:
            server.starttls()
            server.login(GMAIL_EMAIL, GMAIL_APP_PASSWORD.replace(" ", ""))
            server.send_message(msg)
        logger.info(f"Email sent successfully from {contact_data['email']}")
        return None
    except SMTPAuthenticationError:
        logger.error("Gmail authentication failed. Check GMAIL_EMAIL and GMAIL_APP_PASSWORD")
        return jsonify({
            "error": "Gmail authentication failed. Check your Gmail email and 16-character app password."
        }), 503
    except SMTPException as e:
        logger.error(f"SMTP error: {str(e)}")
        return jsonify({"error": "Email server error. Please try again later."}), 503
    except Exception as e:
        logger.error(f"Email sending failed: {str(e)}")
        return jsonify({"error": "Failed to send email"}), 503

def build_chat_context():
    return """
You are Mujahid Islam's professional portfolio AI assistant.

Your job:
- Answer as a concise, helpful assistant for Mujahid's portfolio website.
- Help visitors learn about Mujahid's projects, services, tech stack, and availability.
- Encourage serious project or hiring conversations to use the contact form.

Known portfolio facts:
- Mujahid Islam is a full-stack developer focused on modern web apps, SaaS dashboards, automation tools, and LLM-powered chatbot systems.
- He works with React, Vite, Tailwind CSS, Python, Flask, Django, Django REST Framework, PostgreSQL, Git, GitHub, Vercel, Render, Postman, OpenAI API, Gemini API, Groq API, LangChain, Telegram Bot, WhatsApp API, and Google Sheets API.
- Services include AI chatbots and LLM integration, custom web applications, automation workflows, SaaS and dashboard development, and responsive business websites.
- Projects include Ecomerce Primium Website, AI SalesBot SaaS, Dental Clinic Website, AI Chatbot API Platform, and Portfolio Website.

Rules:
- Do not invent personal details, prices, private contact information, degrees, employers, or guarantees.
- If you do not know something, say that the portfolio does not provide that detail and suggest contacting Mujahid.
- If the user asks unrelated general questions, answer briefly only when useful, then bring the conversation back to Mujahid's work.
- Keep replies under 120 words unless the user asks for detail.
""".strip()

def build_chat_messages(message):
    return [
        {"role": "system", "content": build_chat_context()},
        {"role": "user", "content": message},
    ]

def extract_chat_completion_text(data, provider_name):
    choices = data.get("choices") or []
    if choices:
        message = choices[0].get("message") or {}
        text = message.get("content") or choices[0].get("text")
        if text:
            return text

    result = data.get("result") or {}
    if isinstance(result, dict):
        text = result.get("response") or result.get("text")
        if text:
            return text
        result_choices = result.get("choices") or []
        if result_choices:
            message = result_choices[0].get("message") or {}
            text = message.get("content") or result_choices[0].get("text")
            if text:
                return text

    logger.error("%s returned no assistant text: %s", provider_name, data)
    raise RuntimeError(f"{provider_name} returned no assistant text")

def generate_with_cloudflare(message):
    if not CLOUDFLARE_ACCOUNT_ID or not CLOUDFLARE_API_TOKEN:
        raise RuntimeError("Cloudflare Workers AI credentials are not configured")

    url = (
        "https://api.cloudflare.com/client/v4/accounts/"
        f"{CLOUDFLARE_ACCOUNT_ID}/ai/v1/chat/completions"
    )
    payload = {
        "model": CLOUDFLARE_MODEL,
        "messages": build_chat_messages(message),
        "temperature": CHATBOT_TEMPERATURE,
        "max_tokens": CHATBOT_MAX_TOKENS,
    }

    try:
        logger.info("Calling Cloudflare Workers AI model: %s", CLOUDFLARE_MODEL)
        response = requests.post(
            url,
            json=payload,
            headers={
                "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
                "Content-Type": "application/json",
            },
            timeout=CLOUDFLARE_TIMEOUT_SECONDS,
        )
    except requests.Timeout as error:
        logger.exception("Cloudflare Workers AI request timed out")
        raise RuntimeError("Cloudflare Workers AI request timed out") from error
    except requests.RequestException as error:
        logger.exception("Cloudflare Workers AI request failed")
        raise RuntimeError(f"Cloudflare Workers AI request failed: {error}") from error

    try:
        data = response.json()
    except ValueError as error:
        logger.error("Cloudflare Workers AI returned non-JSON response: %s", response.text)
        raise RuntimeError("Cloudflare Workers AI returned non-JSON response") from error

    logger.info("Cloudflare Workers AI response status=%s", response.status_code)

    if not response.ok:
        # Render logs will include the complete Cloudflare response for troubleshooting.
        logger.error("Cloudflare Workers AI HTTP %s error: %s", response.status_code, data)
        raise RuntimeError(f"Cloudflare Workers AI HTTP {response.status_code}")

    if data.get("success") is False:
        logger.error("Cloudflare Workers AI API error: %s", data)
        raise RuntimeError("Cloudflare Workers AI returned an API error")

    text = extract_chat_completion_text(data, "Cloudflare Workers AI")

    return text.strip(), f"Cloudflare Workers AI {CLOUDFLARE_MODEL}"

def generate_with_openrouter(message):
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OpenRouter API key is not configured")

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": build_chat_messages(message),
        "temperature": CHATBOT_TEMPERATURE,
        "max_tokens": CHATBOT_MAX_TOKENS,
    }

    try:
        logger.info("Calling OpenRouter fallback model: %s", OPENROUTER_MODEL)
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json=payload,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://127.0.0.1:5500",
                "X-Title": "Mujahid Portfolio Assistant",
            },
            timeout=OPENROUTER_TIMEOUT_SECONDS,
        )
    except requests.Timeout as error:
        logger.exception("OpenRouter request timed out")
        raise RuntimeError("OpenRouter request timed out") from error
    except requests.RequestException as error:
        logger.exception("OpenRouter request failed")
        raise RuntimeError(f"OpenRouter request failed: {error}") from error

    try:
        data = response.json()
    except ValueError as error:
        logger.error("OpenRouter returned non-JSON response: %s", response.text)
        raise RuntimeError("OpenRouter returned non-JSON response") from error

    if not response.ok:
        logger.error("OpenRouter HTTP %s error: %s", response.status_code, data)
        raise RuntimeError(f"OpenRouter HTTP {response.status_code}")

    text = extract_chat_completion_text(data, "OpenRouter")

    return text.strip(), f"OpenRouter {OPENROUTER_MODEL}"

def generate_ai_reply(message):
    try:
        return generate_with_cloudflare(message)
    except Exception as cloudflare_error:
        logger.exception("Cloudflare Workers AI failed; trying OpenRouter fallback")
        if OPENROUTER_API_KEY:
            try:
                return generate_with_openrouter(message)
            except Exception:
                logger.exception("OpenRouter fallback failed")
        raise cloudflare_error

@app.route("/api/chat", methods=["POST"])
def chat_endpoint():
    if (not CLOUDFLARE_ACCOUNT_ID or not CLOUDFLARE_API_TOKEN) and not OPENROUTER_API_KEY:
        logger.error("No chatbot AI provider credentials are available")
        return jsonify({
            "reply": CHATBOT_FALLBACK_REPLY,
            "key_in_use": "AI provider unavailable",
            "status": "error"
        })
    
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400
            
        message = data.get("message").strip()
        if not message:
            return jsonify({"error": "Message cannot be empty"}), 400
        
        logger.info(f"Received chat message (length: {len(message)} chars)")
        
        # Rate limiting check (implement proper rate limiting in production)
        current_time = time.time()
        if hasattr(chat_endpoint, 'last_request_time'):
            if current_time - chat_endpoint.last_request_time < 1:  # 1 second delay
                return jsonify({"error": "Please wait before sending another message"}), 429
        chat_endpoint.last_request_time = current_time
        
        try:
            reply, provider = generate_ai_reply(message)
            logger.info(f"Chat response generated successfully using {provider}")
            return jsonify({
                "reply": reply,
                "key_in_use": provider,
                "status": "success"
            })
            
        except Exception as e:
            logger.exception(f"AI provider error: {str(e)}")
            return jsonify({
                "reply": CHATBOT_FALLBACK_REPLY,
                "key_in_use": "Cloudflare Workers AI unavailable",
                "status": "error"
            })
            
    except Exception as e:
        logger.error(f"Server Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/api/contact", methods=["POST"])
def contact_endpoint():
    try:
        contact_data = request.get_json()
        error_response = send_email(contact_data)
        if error_response:
            return error_response
        return jsonify({"status": "success"})
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return jsonify({"error": "Failed to process contact form"}), 500

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not found"}), 404

    requested_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(requested_path) and os.path.isfile(requested_path):
        return send_from_directory(app.static_folder, path)

    index_path = os.path.join(app.static_folder, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, "index.html")

    return jsonify({
        "status": "ok",
        "service": "portfolio",
        "message": "Frontend build not found. Run npm run build before starting the backend."
    })

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=False)
