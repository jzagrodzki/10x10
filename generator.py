import random
import argparse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
from datetime import datetime

# ====== LANGUAGE TRANSLATIONS ======
TRANSLATIONS = {
    'en': {
        'title': 'Multiplication Table Test 1–10',
        'worksheet_id': 'Worksheet ID:',
        'instructions': 'Calculate all results. Write answers in the blanks.'
    },
    'no': {
        'title': 'Gangetabell Test 1–10',
        'worksheet_id': 'Oppgavesett ID:',
        'instructions': 'Regn ut alle resultatene. Skriv svarene på strekene.'
    },
    'pl': {
        'title': 'Test Tabliczki Mnożenia 1–10',
        'worksheet_id': 'ID Arkusza:',
        'instructions': 'Oblicz wszystkie wyniki. Wpisz odpowiedzi w kratkach.'
    }
}

# ====== CONFIGURATION ======
OUTPUT_DIR = "worksheets"
FONT_NAME = "DejaVuSans"

# Try to locate a font that supports Polish characters
FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    "DejaVuSans.ttf",  # if placed in project folder
]

def find_font():
    """Return path to a font supporting Polish characters, or None."""
    for path in FONT_PATHS:
        if os.path.exists(path):
            return path
    return None

def register_font():
    """Register font in ReportLab and return font name to use."""
    path = find_font()
    if path:
        pdfmetrics.registerFont(TTFont(FONT_NAME, path))
        return FONT_NAME
    return "Helvetica"  # fallback if font not found

def generate_seed(user_seed):
    """Return deterministic seed if provided, otherwise random seed."""
    if user_seed is not None:
        return int(user_seed)
    return random.randint(100000, 999999)

def generate_problems(seed):
    """Generate shuffled list of all 1..10 × 1..10 multiplication pairs."""
    random.seed(seed)
    problems = [(a, b) for a in range(1, 11) for b in range(1, 11)]
    random.shuffle(problems)
    return problems

def create_pdf(seed, filename, language='en'):
    """Create worksheet PDF with given seed, output file, and language."""
    font = register_font()
    
    # Get translations for selected language
    trans = TRANSLATIONS.get(language, TRANSLATIONS['en'])

    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(name="TitlePL", parent=styles["Title"], fontName=font)
    normal_style = ParagraphStyle(name="NormalPL", parent=styles["Normal"], fontName=font)

    story = []

    # Title and metadata
    story.append(Paragraph(trans['title'], title_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"{trans['worksheet_id']} <b>{seed}</b>", normal_style))
    story.append(Paragraph(trans['instructions'], normal_style))
    story.append(Spacer(1, 12))

    problems = generate_problems(seed)

    # Arrange problems into a 5-column table
    cols = 5
    rows = len(problems) // cols
    data = []

    idx = 0
    for _ in range(rows):
        row = []
        for _ in range(cols):
            a, b = problems[idx]
            row.append(Paragraph(f"{a} × {b} = ______", normal_style))
            idx += 1
        data.append(row)

    table = Table(data, colWidths=[(A4[0]-72)/cols]*cols, rowHeights=28)
    table.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 0.5, colors.black),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING", (0,0), (-1,-1), 6),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))

    story.append(table)
    doc.build(story)

def main():
    """Command-line interface."""
    parser = argparse.ArgumentParser(description="Multiplication worksheet generator")
    parser.add_argument("--seed", type=int, help="Worksheet ID for deterministic generation")
    parser.add_argument("--out", type=str, help="Output PDF filename")
    parser.add_argument("--lang", type=str, default="en", choices=['en', 'no', 'pl'],
                        help="Language for worksheet (en=English, no=Norwegian, pl=Polish)")
    args = parser.parse_args()

    seed = generate_seed(args.seed)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Default filename if not provided
    if args.out:
        filename = args.out
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{OUTPUT_DIR}/worksheet_{seed}_{timestamp}.pdf"

    create_pdf(seed, filename, args.lang)

    print("Done!")
    print("File:", filename)
    print("Worksheet ID:", seed)
    print("Language:", args.lang)

if __name__ == "__main__":
    main()
