from flask import Blueprint, jsonify

hod_bp = Blueprint(
    "hod",
    __name__,
    url_prefix="/api/hod"
)


@hod_bp.route("/dashboard", methods=["GET"])
def dashboard():

    # ============================================================
    # Faculty under HOD
    # Using the same faculty details created in create_users.py
    # ============================================================

    faculty = [
        {
            "id": "FAC-2026-001",
            "name": "Dr. Akshay Juneja",
            "email": "faculty@university.edu",
            "employeeId": "FAC-2026-001",
            "role": "faculty",
            "status": "Approved",
            "department": "Computer Science",
            "designation": "Assistant Professor",
            "subjects": [
                "Data Structures",
                "Algorithms"
            ],
            "assigned": 5,
            "completed": 4,
            "pending": 1,
            "avgTime": "3.8h",
            "lowConfPct": 4,
            "workload": "Normal"
        },

        {
            "id": "FAC-2026-002",
            "name": "Dr. Aradhya Saini",
            "email": "faculty002@university.edu",
            "employeeId": "FAC-2026-002",
            "role": "faculty",
            "status": "Evaluating",
            "department": "Computer Science",
            "designation": "Assistant Professor",
            "subjects": [
                "Database Management",
                "Operating Systems"
            ],
            "assigned": 5,
            "completed": 3,
            "pending": 2,
            "avgTime": "4.2h",
            "lowConfPct": 6,
            "workload": "High"
        },

        {
            "id": "FAC-2026-003",
            "name": "Ms. Nidhi Rana",
            "email": "faculty003@university.edu",
            "employeeId": "FAC-2026-003",
            "role": "faculty",
            "status": "All Submitted",
            "department": "Computer Science",
            "designation": "Associate Professor",
            "subjects": [
                "Computer Networks",
                "Computer Architecture"
            ],
            "assigned": 4,
            "completed": 4,
            "pending": 0,
            "avgTime": "3.5h",
            "lowConfPct": 3,
            "workload": "Normal"
        },

        {
            "id": "FAC-2026-004",
            "name": "Mr. Ravi Kumar",
            "email": "faculty004@university.edu",
            "employeeId": "FAC-2026-004",
            "role": "faculty",
            "status": "Pending OCR",
            "department": "Computer Science",
            "designation": "Associate Professor",
            "subjects": [
                "Artificial Intelligence",
                "Machine Learning"
            ],
            "assigned": 5,
            "completed": 2,
            "pending": 3,
            "avgTime": "4.6h",
            "lowConfPct": 8,
            "workload": "High"
        },

        {
            "id": "FAC-2026-005",
            "name": "Mr. Kapil Kumar",
            "email": "faculty005@university.edu",
            "employeeId": "FAC-2026-005",
            "role": "faculty",
            "status": "Not Started",
            "department": "Computer Science",
            "designation": "Assistant Professor",
            "subjects": [
                "Software Engineering",
                "Web Technologies"
            ],
            "assigned": 3,
            "completed": 0,
            "pending": 3,
            "avgTime": "0h",
            "lowConfPct": 0,
            "workload": "Low"
        }
    ]

    # ============================================================
    # Pending approvals
    # ============================================================

    pending_approvals = [
        {
            "id": "APR-001",
            "faculty": "Dr. Akshay Juneja",
            "exam": "Data Structures Mid Semester",
            "sheets": 5,
            "avgMarks": 72,
            "lowConf": 1,
            "submittedAt": "Today, 10:30 AM"
        },
        {
            "id": "APR-002",
            "faculty": "Dr. Aradhya Saini",
            "exam": "Database Management",
            "sheets": 4,
            "avgMarks": 68,
            "lowConf": 2,
            "submittedAt": "Today, 11:45 AM"
        },
        {
            "id": "APR-003",
            "faculty": "Ms. Nidhi Rana",
            "exam": "Computer Networks",
            "sheets": 4,
            "avgMarks": 76,
            "lowConf": 0,
            "submittedAt": "Yesterday, 4:20 PM"
        }
    ]

    # ============================================================
    # Calculate statistics from faculty data
    # ============================================================

    total_faculty = len(faculty)

    total_assigned = sum(
        f["assigned"] for f in faculty
    )

    total_completed = sum(
        f["completed"] for f in faculty
    )

    total_pending = sum(
        f["pending"] for f in faculty
    )

    completion_rate = round(
        (total_completed / total_assigned) * 100
    ) if total_assigned else 0

    # Example approval statistics
    approved_sheets = 12

    approval_rate = round(
        (approved_sheets / total_completed) * 100
    ) if total_completed else 0

    # Keep demo values for now.
    on_time_rate = 82
    accuracy_score = 91

    # ============================================================
    # Notifications
    # ============================================================

    notifications = [
        {
            "id": "NOT-001",
            "type": "approval",
            "title": "Evaluation awaiting approval",
            "message": "Dr. Akshay Juneja submitted an evaluation.",
            "time": "10 minutes ago"
        },
        {
            "id": "NOT-002",
            "type": "warning",
            "title": "Low confidence answers detected",
            "message": "Dr. Aradhya Saini has 2 low-confidence responses.",
            "time": "35 minutes ago"
        },
        {
            "id": "NOT-003",
            "type": "info",
            "title": "Faculty evaluation progress",
            "message": "Department completion rate is currently "
                       f"{completion_rate}%.",
            "time": "1 hour ago"
        }
    ]

    # ============================================================
    # Recent activity
    # ============================================================

    recent_activity = [
        {
            "id": "ACT-001",
            "user": "Dr. Akshay Juneja",
            "action": "Submitted evaluation",
            "description": "Data Structures Mid Semester",
            "time": "10 minutes ago"
        },
        {
            "id": "ACT-002",
            "user": "Dr. Aradhya Saini",
            "action": "Evaluation in progress",
            "description": "Database Management",
            "time": "35 minutes ago"
        },
        {
            "id": "ACT-003",
            "user": "Ms. Nidhi Rana",
            "action": "Completed evaluation",
            "description": "Computer Networks",
            "time": "1 hour ago"
        },
        {
            "id": "ACT-004",
            "user": "Mr. Ravi Kumar",
            "action": "OCR processing",
            "description": "Artificial Intelligence",
            "time": "2 hours ago"
        },
        {
            "id": "ACT-005",
            "user": "Mr. Kapil Kumar",
            "action": "Evaluation assigned",
            "description": "Software Engineering",
            "time": "Today"
        }
    ]

    # ============================================================
    # Response
    # ============================================================

    return jsonify({
        "message": "HOD dashboard data retrieved successfully",

        "faculty": faculty,

        "pendingApprovals": pending_approvals,

        "statistics": {
            "totalFaculty": total_faculty,
            "pendingApprovals": len(pending_approvals),
            "totalAssigned": total_assigned,
            "totalCompleted": total_completed,
            "totalPending": total_pending,
            "completionRate": completion_rate,
            "approvalRate": approval_rate,
            "onTimeRate": on_time_rate,
            "accuracyScore": accuracy_score
        },

        "notifications": notifications,

        "recentActivity": recent_activity

    }), 200