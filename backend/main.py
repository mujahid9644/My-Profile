from flask import Flask, request, jsonify, send_from_directory, g
from flask_cors import CORS
import os
import json
from datetime import datetime, timezone
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
import logging
from smtplib import SMTPAuthenticationError, SMTPException
from urllib import request as urllib_request
from urllib.error import HTTPError, URLError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure API keys
GEMINI_API_KEY_1 = os.getenv("GEMINI_API_KEY_1")
GEMINI_API_KEY_2 = os.getenv("GEMINI_API_KEY_2")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
GEMINI_MAX_OUTPUT_TOKENS = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "180"))
GEMINI_TIMEOUT_SECONDS = int(os.getenv("GEMINI_TIMEOUT_SECONDS", "15"))
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")
OPENROUTER_TIMEOUT_SECONDS = int(os.getenv("OPENROUTER_TIMEOUT_SECONDS", "12"))
GMAIL_EMAIL = os.getenv("GMAIL_EMAIL")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
SMTP_TIMEOUT_SECONDS = int(os.getenv("SMTP_TIMEOUT_SECONDS", "8"))
MAX_JSON_BYTES = int(os.getenv("MAX_JSON_BYTES", "32768"))

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

gemini_api_keys = [key.strip() for key in [GEMINI_API_KEY_1, GEMINI_API_KEY_2] if key and key.strip()]

if gemini_api_keys:
    logger.info(f"Configured {len(gemini_api_keys)} Gemini key(s)")
if OPENROUTER_API_KEY:
    logger.info(f"Configured OpenRouter fallback model: {OPENROUTER_MODEL}")
if not gemini_api_keys and not OPENROUTER_API_KEY:
    logger.error("No AI provider key configured")

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
    return """You are Mujahid Islam's AI portfolio assistant.
Mujahid Islam is a Junior Full-Stack Developer & AI/LLM Developer based in Dhaka, Bangladesh (BSc in CSE from Dhaka International University).
His main stack: Django, React, Tailwind CSS, PostgreSQL.
AI skills: LLM integration, AI chatbot, LangChain concept, OpenAI/Gemini/Groq API concept, Telegram bot, WhatsApp bot concept, Google Sheets API concept.
Projects: AI SalesBot SaaS, Dental Clinic Website, AI Chatbot API Platform, Portfolio Website.
Contact: mujahidislam2540@gmail.com, GitHub/LinkedIn.

Rules:
1. NEVER say "Junior Data Analyst". Main identity is Junior Full-Stack Developer and AI/LLM Developer.
2. Keep answers short, smart, and professional. Max 2-4 short sentences.
3. If asked about contact, provide the email.
4. If asked unrelated/spam questions, politely redirect to portfolio, skills, projects, or contact.
5. Use a friendly but professional tone. Do not generate very long explanations."""

def generate_with_gemini(message):
    import google.generativeai as genai

    prompt = f"{build_chat_context()}\n\nUser: {message}\nAssistant:"
    last_error = None
    for index, api_key in enumerate(gemini_api_keys, start=1):
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(GEMINI_MODEL)
            response = model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": GEMINI_MAX_OUTPUT_TOKENS,
                    "temperature": 0.4,
                },
                request_options={"timeout": GEMINI_TIMEOUT_SECONDS}
            )
            if response and response.text:
                return response.text, f"Gemini Key {index}"
            last_error = "No response generated"
        except Exception as e:
            last_error = str(e)
            logger.warning(f"Gemini key {index} failed: {last_error}")
    raise RuntimeError(last_error or "Gemini unavailable")

def generate_with_openrouter(message):
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OpenRouter key is not configured")

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": build_chat_context()},
            {"role": "user", "content": message},
        ],
        "max_tokens": GEMINI_MAX_OUTPUT_TOKENS,
        "temperature": 0.4,
    }
    request_body = json.dumps(payload).encode("utf-8")
    req = urllib_request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=request_body,
        method="POST",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://127.0.0.1:5500",
            "X-Title": "Mujahid Portfolio Assistant",
        },
    )

    try:
        with urllib_request.urlopen(req, timeout=OPENROUTER_TIMEOUT_SECONDS) as response:
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenRouter HTTP {e.code}: {error_body}") from e
    except URLError as e:
        raise RuntimeError(f"OpenRouter connection error: {e.reason}") from e

    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("OpenRouter returned no choices")

    content = choices[0].get("message", {}).get("content")
    if not content:
        raise RuntimeError("OpenRouter returned no message content")
    return content, f"OpenRouter {OPENROUTER_MODEL}"

def generate_ai_reply(message):
    errors = []
    if gemini_api_keys:
        try:
            return generate_with_gemini(message)
        except Exception as e:
            errors.append(f"Gemini: {e}")
            logger.warning(f"Gemini provider failed, trying OpenRouter fallback: {e}")

    if OPENROUTER_API_KEY:
        try:
            return generate_with_openrouter(message)
        except Exception as e:
            errors.append(f"OpenRouter: {e}")
            logger.error(f"OpenRouter provider failed: {e}")

    raise RuntimeError("; ".join(errors) or "No AI provider configured")

@app.route("/api/chat", methods=["POST"])
def chat_endpoint():
    if not gemini_api_keys and not OPENROUTER_API_KEY:
        logger.error("No AI provider keys available")
        return jsonify({"error": "Service not configured"}), 503
    
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
            logger.error(f"AI provider error: {str(e)}")
            return jsonify({
                "error": "AI service temporarily unavailable",
                "detail": str(e)
            }), 503
            
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
