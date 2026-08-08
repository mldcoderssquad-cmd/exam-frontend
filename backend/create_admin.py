from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

# ============================================================
# MongoDB configuration
# ============================================================

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not configured")

client = MongoClient(MONGODB_URI)

db = client["ExamEvaluate"]
users = db["users"]

# ============================================================
# Admin details
# ============================================================

name = "ExamEvaluate Admin"
email = "admin@examevaluate.com"
password = "Admin@12345"

employee_id = "ADM-2026-001"

# ============================================================
# Check if Admin already exists
# ============================================================

existing_user = users.find_one({
    "email": email
})

# ============================================================
# Admin already exists → UPDATE
# ============================================================

if existing_user:

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    users.update_one(
        {
            "_id": existing_user["_id"]
        },
        {
            "$set": {
                "name": name,
                "email": email,
                "password": hashed_password,
                "role": "admin",
                "department": "Administration",
                "designation": "System Administrator",
                "employeeId": employee_id,
                "status": "active"
            }
        }
    )

    print("Admin user updated successfully.")
    print("Email:", email)
    print("Employee ID:", employee_id)
    print("Password:", password)
    print("-" * 50)

# ============================================================
# Admin doesn't exist → CREATE
# ============================================================

else:

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": "admin",
        "department": "Administration",
        "designation": "System Administrator",
        "employeeId": employee_id,
        "status": "active"
    }

    result = users.insert_one(user)

    print("Admin user created successfully.")
    print("User ID:", result.inserted_id)
    print("Email:", email)
    print("Employee ID:", employee_id)
    print("Password:", password)
    print("-" * 50)

# ============================================================
# Close MongoDB connection
# ============================================================

client.close()