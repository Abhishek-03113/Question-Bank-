#!/usr/bin/env python3
"""
seed.py — One-time MongoDB seeder for the Interview Prep Platform.

Reads all JSON files from the output/ directory and upserts records
into the correct MongoDB collections.

Usage:
    python scripts/seed.py

Requires a .env file in the project root with MONGODB_URI set.
"""

import json
import os
import sys
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:
    print(
        "Error: python-dotenv not installed. Run: pip install -r scripts/requirements.txt"
    )
    sys.exit(1)

try:
    from pymongo import MongoClient, UpdateOne
    from pymongo.errors import BulkWriteError
except ImportError:
    print("Error: pymongo not installed. Run: pip install -r scripts/requirements.txt")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Resolve paths relative to this script's location
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_DIR = PROJECT_ROOT / "output"

# Load .env from the project root
load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(PROJECT_ROOT / ".env.local")  # also try .env.local

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/interview_prep")
DB_NAME = MONGODB_URI.rsplit("/", 1)[-1].split("?")[0]  # extract db name from URI

# File → collection mapping.
# For interview_questions_* files the domain is injected automatically.
FILE_MAP = [
    ("aptitude_questions_1.json", "aptitude_questions", None),
    ("cs_1.json", "cs_fundamentals", None),
    ("dsa_questions_1.json", "dsa_questions", None),
    ("sql_questions_1.json", "sql_questions", None),
    ("hld_questions_1.json", "hld_questions", None),
    ("lld_questions_1.json", "lld_questions", None),
    ("interview_questions_ai_1.json", "interview_questions", "ai"),
    ("interview_questions_backend_1.json", "interview_questions", "backend"),
    ("interview_questions_frontend_1.json", "interview_questions", "frontend"),
    ("interview_questions_general_1.json", "interview_questions", "general"),
    ("interview_questions_java_1.json", "interview_questions", "java"),
    (
        "interview_questions_system_design_1.json",
        "interview_questions",
        "system_design",
    ),
    ("interview_questions_data_analyst_1.json", "interview_questions", "data_analyst"),
    ("job-portals_1.json", "job_portals", None),
    ("cold-dms_1.json", "cold_dms", None),
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def load_json_file(filepath: Path) -> list:
    """Load a JSON file and extract the `data` array from its envelope."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = json.load(f)

    if isinstance(content, list):
        return content

    # Standard envelope format: { "metadata": {...}, "data": [...] }
    if isinstance(content, dict) and "data" in content:
        return content["data"]

    raise ValueError(f"Unexpected JSON format in {filepath}")


def build_upsert_ops(records: list, domain: str | None) -> list:
    """Build a list of pymongo UpdateOne (upsert) operations."""
    ops = []
    for record in records:
        doc = dict(record)

        # Inject domain field for interview_questions
        if domain is not None:
            doc["domain"] = domain

        # Use the original `id` field as the upsert key
        id_val = doc.get("id")
        if id_val is None:
            # Skip records without an id (shouldn't happen in clean data)
            print(f"  ⚠  Skipping record with no id: {doc}")
            continue

        ops.append(
            UpdateOne(
                {"id": id_val},
                {"$set": doc},
                upsert=True,
            )
        )
    return ops


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    print(f"Connecting to MongoDB: {MONGODB_URI[:40]}...")
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    print(f"Using database: {DB_NAME}\n")

    total_upserted = 0
    total_modified = 0

    for filename, collection_name, domain in FILE_MAP:
        filepath = OUTPUT_DIR / filename

        if not filepath.exists():
            print(f"  ⚠  File not found, skipping: {filepath}")
            continue

        try:
            records = load_json_file(filepath)
        except (json.JSONDecodeError, ValueError) as e:
            print(f"  ✗  Failed to load {filename}: {e}")
            continue

        if not records:
            print(f"  ⚠  No records found in {filename}")
            continue

        ops = build_upsert_ops(records, domain)
        if not ops:
            continue

        collection = db[collection_name]

        try:
            result = collection.bulk_write(ops, ordered=False)
            upserted = result.upserted_count
            modified = result.modified_count
            total_upserted += upserted
            total_modified += modified
            domain_str = f" [domain={domain}]" if domain else ""
            print(
                f"  ✓  {collection_name}{domain_str}: {len(records)} records → {upserted} inserted, {modified} updated"
            )
        except BulkWriteError as bwe:
            # Partial success is still reported
            details = bwe.details
            upserted = details.get("nUpserted", 0)
            modified = details.get("nModified", 0)
            errors = details.get("writeErrors", [])
            print(
                f"  ⚠  {collection_name}: {upserted} inserted, {modified} updated, {len(errors)} errors"
            )
            for err in errors[:3]:  # show at most 3 errors
                print(f"       Error: {err.get('errmsg', err)}")

    print(f"\n{'='*50}")
    print(f"Seeding complete: {total_upserted} inserted, {total_modified} updated")
    client.close()


if __name__ == "__main__":
    main()
