"""
Professional PDF Generator for Q&A JSON Files
Generates clean, readable PDFs from JSON data files.
"""

import os
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    KeepTogether,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


# Configuration
OUTPUT_DIR = Path("output")
PDF_DIR = Path("pdf")
PDF_DIR.mkdir(exist_ok=True)


class PDFGenerator:
    """Professional PDF generator for Q&A content."""

    def __init__(self):
        """Initialize PDF generator with custom styles."""
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Setup custom paragraph styles for professional look."""
        # Title style
        self.styles.add(
            ParagraphStyle(
                name="CustomTitle",
                parent=self.styles["Heading1"],
                fontSize=24,
                textColor=colors.HexColor("#1a1a1a"),
                spaceAfter=30,
                alignment=TA_CENTER,
                fontName="Helvetica-Bold",
            )
        )

        # Subtitle style
        self.styles.add(
            ParagraphStyle(
                name="Subtitle",
                parent=self.styles["Normal"],
                fontSize=12,
                textColor=colors.HexColor("#666666"),
                spaceAfter=20,
                alignment=TA_CENTER,
                fontName="Helvetica",
            )
        )

        # Section header style
        self.styles.add(
            ParagraphStyle(
                name="SectionHeader",
                parent=self.styles["Heading2"],
                fontSize=16,
                textColor=colors.HexColor("#2c3e50"),
                spaceAfter=12,
                spaceBefore=20,
                fontName="Helvetica-Bold",
                borderWidth=0,
                borderColor=colors.HexColor("#3498db"),
                borderPadding=5,
            )
        )

        # Question style
        self.styles.add(
            ParagraphStyle(
                name="Question",
                parent=self.styles["Heading3"],
                fontSize=12,
                textColor=colors.HexColor("#2c3e50"),
                spaceAfter=8,
                spaceBefore=15,
                fontName="Helvetica-Bold",
                leftIndent=0,
            )
        )

        # Answer style
        self.styles.add(
            ParagraphStyle(
                name="Answer",
                parent=self.styles["Normal"],
                fontSize=10,
                textColor=colors.HexColor("#34495e"),
                spaceAfter=15,
                alignment=TA_JUSTIFY,
                fontName="Helvetica",
                leftIndent=10,
                rightIndent=10,
                leading=14,
            )
        )

        # Metadata style
        self.styles.add(
            ParagraphStyle(
                name="Metadata",
                parent=self.styles["Normal"],
                fontSize=9,
                textColor=colors.HexColor("#7f8c8d"),
                spaceAfter=5,
                fontName="Helvetica-Oblique",
                leftIndent=10,
            )
        )

        # Cold DM styles
        self.styles.add(
            ParagraphStyle(
                name="DMTitle",
                parent=self.styles["Heading3"],
                fontSize=11,
                textColor=colors.HexColor("#2c3e50"),
                spaceAfter=6,
                spaceBefore=12,
                fontName="Helvetica-Bold",
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="DMDescription",
                parent=self.styles["Normal"],
                fontSize=10,
                textColor=colors.HexColor("#34495e"),
                spaceAfter=10,
                alignment=TA_JUSTIFY,
                fontName="Helvetica",
                leftIndent=10,
                rightIndent=10,
                leading=13,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="DMCategory",
                parent=self.styles["Normal"],
                fontSize=9,
                textColor=colors.HexColor("#16a085"),
                spaceAfter=8,
                fontName="Helvetica-Bold",
                leftIndent=10,
            )
        )

    def _create_header(self, title: str, metadata: Dict[str, Any]) -> List:
        """Create PDF header with title and metadata."""
        story = []

        # Title
        story.append(Paragraph(title, self.styles["CustomTitle"]))

        # Metadata
        timestamp = metadata.get("timestamp", "")
        if timestamp:
            try:
                dt = datetime.fromisoformat(timestamp)
                formatted_date = dt.strftime("%B %d, %Y at %I:%M %p")
            except:
                formatted_date = timestamp

        record_count = metadata.get("record_count", 0)
        subtitle_text = f"Generated on {formatted_date} | {record_count} entries"
        story.append(Paragraph(subtitle_text, self.styles["Subtitle"]))

        # Divider
        story.append(Spacer(1, 0.3 * inch))

        return story

    def _format_difficulty_badge(self, difficulty: str) -> str:
        """Format difficulty as colored badge."""
        color_map = {
            "easy": "#27ae60",
            "medium": "#f39c12",
            "hard": "#e74c3c",
        }
        color = color_map.get(difficulty.lower(), "#95a5a6")
        return f'<font color="{color}"><b>[{difficulty.upper()}]</b></font>'

    def _create_question_entry(self, item: Dict[str, Any], index: int) -> List:
        """Create a formatted question-answer entry."""
        elements = []

        # Question number and text
        question_text = item.get("question", "No question provided")
        question_html = f"<b>Q{index}.</b> {self._escape_html(question_text)}"
        elements.append(Paragraph(question_html, self.styles["Question"]))

        # Metadata line (difficulty, category, etc.)
        metadata_parts = []

        difficulty = item.get("difficulty")
        if difficulty:
            metadata_parts.append(self._format_difficulty_badge(difficulty))

        category = item.get("category") or item.get("section")
        if category:
            metadata_parts.append(f"<b>Category:</b> {category}")

        type_field = item.get("type")
        if type_field:
            metadata_parts.append(f"<b>Type:</b> {type_field}")

        if metadata_parts:
            metadata_html = " | ".join(metadata_parts)
            elements.append(Paragraph(metadata_html, self.styles["Metadata"]))

        # Answer
        answer_text = item.get("answer", "No answer provided")
        answer_html = f"<b>Answer:</b> {self._escape_html(answer_text)}"
        elements.append(Paragraph(answer_html, self.styles["Answer"]))

        # Additional fields for aptitude questions
        short_desc = item.get("short_description")
        if short_desc:
            elements.append(
                Paragraph(
                    f"<b>Summary:</b> {self._escape_html(short_desc)}",
                    self.styles["Metadata"],
                )
            )

        # Add spacing
        elements.append(Spacer(1, 0.15 * inch))

        return [KeepTogether(elements)]

    def _create_cold_dm_entry(self, item: Dict[str, Any], index: int) -> List:
        """Create a formatted cold DM entry."""
        elements = []

        # Title
        title = item.get("Title", "Untitled")
        title_html = f"<b>{index}.</b> {self._escape_html(title)}"
        elements.append(Paragraph(title_html, self.styles["DMTitle"]))

        # Category
        category = item.get("Category")
        if category:
            category_html = f'<font color="#16a085">■ {category}</font>'
            elements.append(Paragraph(category_html, self.styles["DMCategory"]))

        # Description
        description = item.get("Description", "No description provided")
        elements.append(
            Paragraph(self._escape_html(description), self.styles["DMDescription"])
        )

        # Add spacing
        elements.append(Spacer(1, 0.12 * inch))

        return [KeepTogether(elements)]

    def _escape_html(self, text: str) -> str:
        """Escape HTML special characters."""
        if not isinstance(text, str):
            text = str(text)
        text = text.replace("&", "&amp;")
        text = text.replace("<", "&lt;")
        text = text.replace(">", "&gt;")
        text = text.replace('"', "&quot;")
        text = text.replace("'", "&#39;")
        return text

    def generate_qa_pdf(self, json_path: Path, output_path: Path):
        """Generate Q&A format PDF from JSON file."""
        # Read JSON data
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        metadata = data.get("metadata", {})
        items = data.get("data", [])

        # Create PDF
        doc = SimpleDocTemplate(
            str(output_path),
            pagesize=letter,
            rightMargin=0.75 * inch,
            leftMargin=0.75 * inch,
            topMargin=0.75 * inch,
            bottomMargin=0.75 * inch,
        )

        story = []

        # Create title from resource name
        resource_name = metadata.get("resource", json_path.stem)
        title = resource_name.replace("_", " ").title()

        # Add header
        story.extend(self._create_header(title, metadata))

        # Add questions and answers
        for idx, item in enumerate(items, 1):
            story.extend(self._create_question_entry(item, idx))

            # Add page break every 5-7 questions for better readability
            if idx % 6 == 0 and idx < len(items):
                story.append(PageBreak())

        # Build PDF
        doc.build(story)
        print(f"✓ Generated: {output_path.name}")

    def generate_cold_dm_pdf(self, json_path: Path, output_path: Path):
        """Generate simple format PDF for cold DMs."""
        # Read JSON data
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        metadata = data.get("metadata", {})
        items = data.get("data", [])

        # Create PDF
        doc = SimpleDocTemplate(
            str(output_path),
            pagesize=letter,
            rightMargin=0.75 * inch,
            leftMargin=0.75 * inch,
            topMargin=0.75 * inch,
            bottomMargin=0.75 * inch,
        )

        story = []

        # Add header
        story.extend(self._create_header("Cold DM Templates", metadata))

        # Add intro
        intro_text = (
            "Professional cold direct message templates for networking and "
            "job seeking. Customize these templates by replacing placeholders "
            "with specific information."
        )
        story.append(Paragraph(intro_text, self.styles["Answer"]))
        story.append(Spacer(1, 0.3 * inch))

        # Add DM entries
        for idx, item in enumerate(items, 1):
            story.extend(self._create_cold_dm_entry(item, idx))

            # Add page break every 8 entries
            if idx % 8 == 0 and idx < len(items):
                story.append(PageBreak())

        # Build PDF
        doc.build(story)
        print(f"✓ Generated: {output_path.name}")

    def generate_all_pdfs(self):
        """Generate PDFs for all JSON files in output directory."""
        json_files = list(OUTPUT_DIR.glob("*.json"))

        if not json_files:
            print("❌ No JSON files found in output directory")
            return

        print("=" * 70)
        print("📄 PDF Generator")
        print("=" * 70)
        print(f"\nFound {len(json_files)} JSON file(s) to process\n")

        for json_file in sorted(json_files):
            # Generate output PDF path
            pdf_name = json_file.stem + ".pdf"
            pdf_path = PDF_DIR / pdf_name

            try:
                # Check if it's a cold DM file
                if "cold-dms" in json_file.stem.lower():
                    self.generate_cold_dm_pdf(json_file, pdf_path)
                else:
                    self.generate_qa_pdf(json_file, pdf_path)

            except Exception as e:
                print(f"❌ Error generating {pdf_name}: {e}")
                continue

        print("\n" + "=" * 70)
        print(f"✅ PDF generation completed!")
        print(f"📁 PDFs saved to: {PDF_DIR.absolute()}")
        print("=" * 70)


def main():
    """Main function to run PDF generation."""
    generator = PDFGenerator()
    generator.generate_all_pdfs()


if __name__ == "__main__":
    main()
