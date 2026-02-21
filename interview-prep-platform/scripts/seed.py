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
if not DB_NAME:
    # Fallback to a sensible default when the URI has no trailing database
    # component (e.g. mongodb+srv://host/). This prevents pymongo raising
    # InvalidName errors later on.
    DB_NAME = "interview_prep"
    print(
        "  ⚠  Warning: MONGODB_URI contains no database name; defaulting to 'interview_prep'"
    )

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


def ensure_collection_and_index(db, collection_name: str) -> None:
    """Ensure the collection exists and that a unique index on `id` is present.

    This creates the collection if it doesn't exist (safe to call even when
    the collection already exists) and attempts to create a unique index on
    the `id` field. Index creation failures are non-fatal and reported.
    """
    try:
        existing = db.list_collection_names()
    except Exception:
        # If list_collection_names fails for some reason, continue and let
        # the later create_collection call surface the error.
        existing = []

    if collection_name not in existing:
        try:
            db.create_collection(collection_name)
            print(f"  ℹ  Created collection: {collection_name}")
        except Exception as e:
            # If the collection was created concurrently or cannot be created,
            # log and continue — we'll still obtain the collection handle below.
            print(f"  ⚠  Could not create collection {collection_name}: {e}")

    collection = db[collection_name]
    try:
        # Create a unique index on `id` to support fast upserts.
        # If the index already exists this is a no-op.
        indexes = collection.index_information()
        # Typical index name for single-field ascending index is 'id_1'. Check
        # indexes to avoid unnecessary creation attempt.
        if not any(
            "id" in info.get("key", []) or info_name == "id_1"
            for info_name, info in indexes.items()
        ):
            collection.create_index([("id", 1)], unique=True)
            print(f"  ℹ  Created unique index on 'id' for {collection_name}")
    except Exception as e:
        # If index creation fails (e.g., duplicate keys present), continue but
        # warn the user — upserts will still work, but may be slower.
        print(f"  ⚠  Failed to create index on {collection_name}: {e}")


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

        # Ensure the collection exists and has an `id` index before writing.
        ensure_collection_and_index(db, collection_name)
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
