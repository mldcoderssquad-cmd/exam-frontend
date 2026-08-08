import os
import sys

from dotenv import load_dotenv
from pymongo import MongoClient

# ============================================================
# Backend directory
# ============================================================

BACKEND_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# ============================================================
# Import the SAME password hashing function used by Flask
# ============================================================

from utils.security import hash_password

# ============================================================
# Load .env
# ============================================================

load_dotenv(
    os.path.join(
        BACKEND_DIR,
        ".env"
    )
)

# ============================================================
# MongoDB connection
# ============================================================

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI is not configured in .env"
    )

client = MongoClient(MONGODB_URI)

# ============================================================
# Database and collection
# ============================================================

db = client["ExamEvaluate"]
users = db["users"]

# ============================================================
# Users to create/update
# ============================================================

new_users = [
    {
        "name": "Dr. Akshay Juneja",
        "email": "faculty@university.edu",
        "password": "Faculty@123",
        "employeeId": "FAC-2026-001",
        "role": "faculty",
        "status": "active",
        "department": "Computer Science",
        "designation": "Assistant Professor",
    },

    {
        "name": "Prof. Deepak Painuli",
        "email": "hod@university.edu",
        "password": "HOD@1234",
        "employeeId": "HOD-2026-001",
        "role": "hod",
        "status": "active",
        "department": "Computer Science",
        "designation": "Head of Department",
    },

    {
        "name": "Prof. Gessu Thakur",
        "email": "dean@university.edu",
        "password": "Dean@123",
        "employeeId": "DEAN-2026-001",
        "role": "dean",
        "status": "active",
        "department": "Academics",
        "designation": "Dean of Academics",
    },
]

# ============================================================
# Create or update users
# ============================================================

for user in new_users:

    email = user["email"].strip().lower()

    # --------------------------------------------------------
    # Check whether user already exists
    # --------------------------------------------------------

    existing_user = users.find_one(
        {
            "email": email
        }
    )

    # --------------------------------------------------------
    # Existing user
    # --------------------------------------------------------

    if existing_user:

        # Hash password using the SAME bcrypt implementation
        # used by the Flask login endpoint.
        hashed_password = hash_password(
            user["password"]
        )

        users.update_one(
            {
                "_id": existing_user["_id"]
            },
            {
                "$set": {
                    "name": user["name"],
                    "email": email,
                    "password": hashed_password,
                    "employeeId": user["employeeId"],
                    "role": user["role"],
                    "status": user["status"],
                    "department": user["department"],
                    "designation": user["designation"],
                }
            }
        )

        print(
            f"Updated existing user: {email}"
        )
        print(
            f"Role: {user['role']}"
        )
        print(
            f"Employee ID: {user['employeeId']}"
        )
        print(
            f"Password: {user['password']}"
        )
        print("-" * 50)

    # --------------------------------------------------------
    # New user
    # --------------------------------------------------------

    else:

        hashed_password = hash_password(
            user["password"]
        )

        user_to_insert = {
            "name": user["name"],
            "email": email,
            "password": hashed_password,
            "employeeId": user["employeeId"],
            "role": user["role"],
            "status": user["status"],
            "department": user["department"],
            "designation": user["designation"],
        }

        result = users.insert_one(
            user_to_insert
        )

        print(
            f"Created user: {email}"
        )
        print(
            f"Role: {user['role']}"
        )
        print(
            f"Employee ID: {user['employeeId']}"
        )
        print(
            f"MongoDB ID: {result.inserted_id}"
        )
        print(
            f"Password: {user['password']}"
        )
        print("-" * 50)

# ============================================================
# Finished
# ============================================================

print(
    "User creation/update completed."
)