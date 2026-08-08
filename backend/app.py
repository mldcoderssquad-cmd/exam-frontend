import os

from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

from routes.auth import auth_bp


# Load environment variables
load_dotenv()


# --------------------------------------------------
# Configuration
# --------------------------------------------------

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


# --------------------------------------------------
# Flask
# --------------------------------------------------

app = Flask(__name__)

CORS(app)


# --------------------------------------------------
# MongoDB
# --------------------------------------------------

client = MongoClient(MONGODB_URI)

db = client["ExamEvaluate"]

# Test MongoDB connection
client.admin.command("ping")


# --------------------------------------------------
# Routes
# --------------------------------------------------

app.register_blueprint(auth_bp)


@app.route("/")
def home():
    return jsonify({
        "message": "ExamEvaluate Flask backend is running"
    })


@app.route("/api/health")
def health():
    try:
        client.admin.command("ping")

        return jsonify({
            "message": "Flask and MongoDB are connected",
            "status": "success"
        })

    except Exception as e:

        return jsonify({
            "message": "MongoDB connection failed",
            "status": "error",
            "error": str(e)
        }), 500


# --------------------------------------------------
# Start server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False,
        host="127.0.0.1",
        port=5000
    )