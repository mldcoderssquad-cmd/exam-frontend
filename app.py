import os

from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

from routes.auth import auth_bp
from routes.hod import hod_bp
from routes.admin import admin_bp


# =========================================================
# Load environment variables
# =========================================================

load_dotenv()


# =========================================================
# Configuration
# =========================================================

MONGODB_URI = os.getenv("MONGODB_URI")
JWT_SECRET = os.getenv("JWT_SECRET")

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI is not configured in .env"
    )

if not JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET is not configured in .env"
    )


# =========================================================
# Flask Application
# =========================================================

app = Flask(__name__)

CORS(app)


# =========================================================
# MongoDB
# =========================================================

client = MongoClient(MONGODB_URI)

db = client["ExamEvaluate"]


# =========================================================
# Test MongoDB Connection
# =========================================================

try:
    client.admin.command("ping")
    print("MongoDB connected successfully")

except Exception as e:
    print("MongoDB connection failed:", str(e))


# =========================================================
# Routes / Blueprints
# =========================================================

app.register_blueprint(auth_bp)

app.register_blueprint(hod_bp)

app.register_blueprint(admin_bp)


# =========================================================
# Home
# =========================================================

@app.route("/")
def home():

    return jsonify({
        "message": "ExamEvaluate Flask backend is running"
    })


# =========================================================
# Health Check
# =========================================================

@app.route("/api/health")
def health():

    try:

        client.admin.command("ping")

        return jsonify({
            "message": "Flask and MongoDB are connected",
            "status": "success"
        }), 200

    except Exception as e:

        return jsonify({
            "message": "MongoDB connection failed",
            "status": "error",
            "error": str(e)
        }), 500


# =========================================================
# Start Server
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        use_reloader=False,
        host="127.0.0.1",
        port=5000
    )
