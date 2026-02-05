import os
import json
import requests
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass
from enum import Enum
from typing import Optional, Dict
from dotenv import load_dotenv
import shutil

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
API_KEY = os.getenv("SUPABASE_API_KEY")
BEARER_TOKEN = os.getenv("SUPABASE_BEARER_TOKEN")

# Create output directory if it doesn't exist
OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)


@dataclass
class ResourceConfig:
    """Configuration for a Supabase resource."""

    table_name: str
    select: str = "*"
    order: Optional[str] = None
    filters: Optional[Dict[str, str]] = None
    limit: Optional[int] = None
    offset: Optional[int] = None

    def get_params(self) -> Dict[str, str]:
        """Generate query parameters for the API request."""
        params = {"select": self.select}

        if self.order:
            params["order"] = self.order
        if self.limit is not None:
            params["limit"] = str(self.limit)
        if self.offset is not None:
            params["offset"] = str(self.offset)
        if self.filters:
            params.update(self.filters)

        return params


class SupabaseResource(Enum):
    """Enum for Supabase resources with their default configurations."""

    CS = ResourceConfig(table_name="cs", select="*", order="id.asc")

    APTITUDE_QUESTIONS = ResourceConfig(
        table_name="aptitude_questions",
        select="*",
        order="popularity.desc.nullslast,created_at.desc",
    )

    SQL_QUESTIONS = ResourceConfig(
        table_name="sql_questions", select="*", order="id.asc"
    )

    DSA_QUESTIONS = ResourceConfig(
        table_name="dsa_questions", select="*", order="index.asc"
    )

    INTERVIEW_QUESTIONS_FRONTEND = ResourceConfig(
        table_name="interview_questions_frontend",
        select="id,question,answer,difficulty,section",
        filters={"section": "eq.Frontend Developer"},
    )

    INTERVIEW_QUESTIONS_BACKEND = ResourceConfig(
        table_name="interview_questions_backend",
        select="id,question,answer,difficulty,section",
        filters={"section": "eq.Backend Developer"},
        offset=5,
        limit=100,
    )

    INTERVIEW_QUESTIONS_AI = ResourceConfig(
        table_name="interview_questions_ai",
        select="id,question,answer,difficulty,section",
        filters={"section": "eq.ai"},
    )

    INTERVIEW_QUESTIONS_SYSTEM_DESIGN = ResourceConfig(
        table_name="interview_questions_system_design",
        select="id,question,answer,difficulty,section",
        filters={"section": "eq.System Design & Architecture"},
    )

    INTERVIEW_QUESTIONS_GENERAL = ResourceConfig(
        table_name="interview_questions_general",
        select="id,question,answer,difficulty,section",
        filters={"section": "eq.General Interview Questions"},
    )

    INTERVIEW_QUESTIONS_JAVA = ResourceConfig(
        table_name="interview_questions_java",
        select="id,question,answer,difficulty,section",
        filters={"section": "eq.Java"},
    )

    INTERVIEW_QUESTIONS_DATA_ANALYST = ResourceConfig(
        table_name="interview_questions_data_analyst",
        select="id,question,answer,difficulty,section",
        filters={"section": "eq.data_analyst"},
    )

    LLD_QUESTIONS = ResourceConfig(
        table_name="lld_questions", select="*", order="id.asc"
    )

    HLD_QUESTIONS = ResourceConfig(
        table_name="hld_questions", select="*", order="id.asc"
    )

    JOB_PORTALS = ResourceConfig(table_name="job-portals", select="*")

    COLD_DMS = ResourceConfig(table_name="cold-dms", select="*", order="Title.asc")

    @property
    def config(self) -> ResourceConfig:
        """Get the resource configuration."""
        return self.value

    def customize(self, **kwargs) -> ResourceConfig:
        """
        Create a customized copy of the resource configuration.

        Args:
            **kwargs: Parameters to override (select, order, filters, limit, offset)

        Returns:
            New ResourceConfig with customized parameters
        """
        config = self.config
        params = {
            "table_name": config.table_name,
            "select": kwargs.get("select", config.select),
            "order": kwargs.get("order", config.order),
            "filters": kwargs.get("filters", config.filters),
            "limit": kwargs.get("limit", config.limit),
            "offset": kwargs.get("offset", config.offset),
        }
        return ResourceConfig(**params)


def clear_output_directory():
    """
    Clear all JSON files from the output directory before scraping.
    """
    if OUTPUT_DIR.exists():
        json_files = list(OUTPUT_DIR.glob("*.json"))
        if json_files:
            print(f"\n🗑️  Clearing {len(json_files)} old JSON file(s)...")
            for json_file in json_files:
                json_file.unlink()
            print("✓ Output directory cleared")
    else:
        OUTPUT_DIR.mkdir(exist_ok=True)


def get_next_file_id(resource_name):
    """Get the next available file ID for a resource group."""
    existing_files = list(OUTPUT_DIR.glob(f"{resource_name}_*.json"))
    if not existing_files:
        return 1

    # Extract IDs from existing files
    ids = []
    for file in existing_files:
        try:
            # Extract ID from filename like "backend_1.json"
            id_part = file.stem.split("_")[-1]
            ids.append(int(id_part))
        except (ValueError, IndexError):
            continue

    return max(ids) + 1 if ids else 1


def fetch_data(resource_config: ResourceConfig):
    """
    Fetch data from Supabase API following Supabase REST conventions.

    Args:
        resource_config: ResourceConfig object with table name and query parameters

    Returns:
        Response data as list or dictionary
    """
    # Extract the actual table name (before any category suffix)
    table_name = resource_config.table_name
    if table_name.startswith("interview_questions_"):
        table_name = "interview_questions"

    url = f"{SUPABASE_URL}/rest/v1/{table_name}"

    headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    params = resource_config.get_params()

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching data from {resource_config.table_name}: {e}")
        if hasattr(e, "response") and hasattr(e.response, "text"):
            print(f"Response: {e.response.text}")
        raise


def save_to_json(data, resource_name):
    """
    Save data to JSON file with incremental naming.

    Args:
        data: Data to save
        resource_name: Name of the resource group (e.g., 'backend', 'frontend')

    Returns:
        Path to saved file
    """
    file_id = get_next_file_id(resource_name)
    filename = f"{resource_name}_{file_id}.json"
    filepath = OUTPUT_DIR / filename

    # Add metadata
    output_data = {
        "metadata": {
            "resource": resource_name,
            "file_id": file_id,
            "timestamp": datetime.now().isoformat(),
            "record_count": len(data) if isinstance(data, list) else 1,
        },
        "data": data,
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"✓ Data saved to: {filepath}")
    print(f"  Records: {output_data['metadata']['record_count']}")
    return filepath


def scrape_resource(
    resource: SupabaseResource, custom_config: Optional[ResourceConfig] = None
):
    """
    Scrape data from a Supabase resource.

    Args:
        resource: SupabaseResource enum value
        custom_config: Optional custom ResourceConfig to override defaults

    Returns:
        Path to the saved JSON file
    """
    config = custom_config if custom_config else resource.config

    print(f"\n📥 Fetching from: {config.table_name}")
    print(f"   Query params: {config.get_params()}")

    data = fetch_data(config)

    # Use table name as the base filename (resource group name)
    filepath = save_to_json(data, config.table_name)

    return filepath


def main():
    """Main function to orchestrate data scraping."""
    # Validate environment variables
    if not all([SUPABASE_URL, API_KEY, BEARER_TOKEN]):
        print("❌ Error: Missing environment variables!")
        print(
            "Please set SUPABASE_URL, SUPABASE_API_KEY, and SUPABASE_BEARER_TOKEN in .env file"
        )
        return

    print("=" * 70)
    print("🚀 Supabase Data Scraper")
    print("=" * 70)

    # Clear old JSON files before starting
    clear_output_directory()

    # Scrape all resources with default configurations
    scrape_resource(SupabaseResource.CS)
    scrape_resource(SupabaseResource.APTITUDE_QUESTIONS)
    scrape_resource(SupabaseResource.SQL_QUESTIONS)
    scrape_resource(SupabaseResource.DSA_QUESTIONS)

    # Scrape all interview question categories
    scrape_resource(SupabaseResource.INTERVIEW_QUESTIONS_FRONTEND)
    scrape_resource(SupabaseResource.INTERVIEW_QUESTIONS_BACKEND)
    scrape_resource(SupabaseResource.INTERVIEW_QUESTIONS_AI)
    scrape_resource(SupabaseResource.INTERVIEW_QUESTIONS_SYSTEM_DESIGN)
    scrape_resource(SupabaseResource.INTERVIEW_QUESTIONS_GENERAL)
    scrape_resource(SupabaseResource.INTERVIEW_QUESTIONS_JAVA)
    scrape_resource(SupabaseResource.INTERVIEW_QUESTIONS_DATA_ANALYST)

    # Scrape design questions
    scrape_resource(SupabaseResource.LLD_QUESTIONS)
    scrape_resource(SupabaseResource.HLD_QUESTIONS)

    # Scrape job-related resources
    scrape_resource(SupabaseResource.JOB_PORTALS)
    scrape_resource(SupabaseResource.COLD_DMS)

    # Example: Customize query parameters for a specific resource
    # custom_config = SupabaseResource.CS.customize(
    #     limit=50,
    #     offset=10,
    #     order='id.desc'
    # )
    # scrape_resource(SupabaseResource.CS, custom_config)

    # Example: Add filters to a resource
    # custom_aptitude = SupabaseResource.APTITUDE_QUESTIONS.customize(
    #     filters={'difficulty': 'eq.hard'},
    #     limit=20
    # )
    # scrape_resource(SupabaseResource.APTITUDE_QUESTIONS, custom_aptitude)

    print("\n" + "=" * 70)
    print("✅ Scraping completed!")
    print("=" * 70)


if __name__ == "__main__":
    main()
