import sys, os, json, re
import requests
from bs4 import BeautifulSoup
from pathlib import Path

# Load prompt templates
with open("config.json", "r") as f:
    config = json.load(f)

def extract_gr_no(text):
    match = re.search(r'(G\\.R\\. No\\. \\d+)', text)
    return match.group(1).replace(" ", "_") if match else "unknown_gr"

def clean_html(html):
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["a", "sup", "script", "style"]): tag.decompose()
    text = soup.get_text(separator="\n")
    return re.sub(r"\n{2,}", "\n\n", text.strip())

def get_case_sections(text):
    # For forward chaining, just slice sequentially
    lower = text.lower()
    idx_facts = lower.find("facts")
    idx_issues = lower.find("issues")
    idx_rulings = lower.find("ruling")

    sections = {
        "facts": text[idx_facts:idx_issues] if idx_facts != -1 and idx_issues != -1 else "",
        "issues": text[idx_issues:idx_rulings] if idx_issues != -1 and idx_rulings != -1 else "",
        "rulings": text[idx_rulings:] if idx_rulings != -1 else "",
    }
    return sections

def simulate_ai_response(prompt: str, text: str):
    # Placeholder for real OpenAI/Gemini response
    return f"[Simulated Forward Output: {prompt[:30]}...]"

def main():
    if len(sys.argv) < 2:
        print("Usage: forward.py <url>")
        return

    url = sys.argv[1]
    html = requests.get(url).text
    cleaned_text = clean_html(html)
    gr_no = extract_gr_no(cleaned_text)

    sections = get_case_sections(cleaned_text)

    summary = {
        "gr_no": gr_no.replace("_", " "),
        "facts": simulate_ai_response(config["FACTS"]["Instructor_Extractive"], sections["facts"]),
        "issues": simulate_ai_response(config["ISSUES"]["Judge_Extractive"], sections["issues"]),
        "rulings": simulate_ai_response(config["RULINGS"]["Instructor_ChainOfThought"], sections["rulings"]),
    }

    out_dir = Path("public/downloads")
    out_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{gr_no}_digested.txt"
    with open(out_dir / filename, "w") as f:
        f.write(json.dumps(summary, indent=2))

    print(json.dumps({
        "summary": summary,
        "downloadUrl": f"/downloads/{filename}"
    }))

if __name__ == "__main__":
    main()
