import os
import re
import json
import time
import requests
import streamlit as st
import polars as pl
from groq import Groq
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# =====================================================
# CONFIG
# =====================================================
BASE_URL = "https://docs.pola.rs/"
SCRAPE_FILE = "polar.txt"
OUTPUT_JSON = "groq_cards.json"
ENDPOINT_URL = "https://coy-river-untaking.ngrok-free.dev/ingest"

# =====================================================
# SCRAPER
# =====================================================
def scrape_page(url):
    """Scrape a single page's visible text content."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        content = []
        for tag in soup.find_all(["h1", "h2", "h3", "p", "pre", "code", "li"]):
            text = tag.get_text(strip=True)
            if text:
                content.append(text)
        return "\n".join(content)
    except Exception as e:
        st.error(f"❌ Failed to scrape {url}: {e}")
        return ""

def crawl_docs(base_url):
    """Crawl all linked documentation pages."""
    visited = set()
    queue = [base_url]

    with open(SCRAPE_FILE, "w", encoding="utf-8") as f:
        f.write("")

    while queue:
        url = queue.pop(0)
        if url in visited or not url.startswith(base_url):
            continue
        visited.add(url)

        st.write(f"📄 Scraping: {url}")
        text = scrape_page(url)
        if text:
            with open(SCRAPE_FILE, "a", encoding="utf-8") as f:
                f.write(f"\n\n===== {url} =====\n\n{text}\n\n")

        try:
            soup = BeautifulSoup(requests.get(url, timeout=10).text, "html.parser")
            for link in soup.find_all("a", href=True):
                full_link = urljoin(url, link["href"])
                if full_link.startswith(base_url) and full_link not in visited:
                    queue.append(full_link)
        except Exception:
            pass

        time.sleep(0.5)

    st.success(f"✅ Done! Full documentation saved to {SCRAPE_FILE}")

# =====================================================
# POLARS PREPROCESSING
# =====================================================
def load_and_chunk_txt(txt_path, chunk_size_chars=3000):
    """Preprocess scraped documentation and extract only main topics using Polars."""
    with open(txt_path, "r", encoding="utf-8") as f:
        raw = f.read()

    # Split scraped pages by URL markers
    pages = re.findall(r"===== (.*?) =====\s*\n(.*?)(?=\n===== |$)", raw, re.DOTALL)
    if not pages:
        st.warning("No pages found in scraped file.")
        return []

    df = pl.DataFrame(pages, schema=["url", "content"])

    # Clean and filter
    df = df.with_columns([
        pl.col("content").str.replace_all(r"\s+", " ").alias("content_clean")
    ])
    df = df.filter(pl.col("content_clean").str.len_chars() > 500)

    # Focus on main topics
    main_keywords = [
        "overview", "introduction", "concept", "guide", "tutorial",
        "architecture", "usage", "examples", "api", "reference", "core", "expression"
    ]
    df = df.filter(
        pl.any_horizontal([pl.col("url").str.contains(k, case=False) for k in main_keywords])
    )

    if df.height == 0:
        st.warning("⚠️ No main topics found — using all content instead.")
        df = pl.DataFrame(pages, schema=["url", "content"])

    # Merge into chunks
    chunks, current = [], ""
    for content in df["content"].to_list():
        if len(current) + len(content) + 2 <= chunk_size_chars:
            current = (current + "\n\n" + content).strip()
        else:
            if current:
                chunks.append(current)
            current = content
    if current:
        chunks.append(current)

    st.info(f"🧩 Selected {df.height} main pages → {len(chunks)} chunks for Groq.")
    return chunks

# =====================================================
# GROQ MODEL CALL
# =====================================================
def generate_cards(doc_chunks, api_key):
    """Generate Motia-style learning cards using Groq."""
    client = Groq(api_key=api_key)
    all_cards = []
    model_name = "llama-3.3-70b-versatile"

    prompt = """
You are an AI assistant that converts technical documentation into structured learning cards.
Each card must follow this structure:

{
  "title": "Concept or Feature Name",
  "explanation": "A **detailed, comprehensive, and beginner-friendly explanation of the concept, using analogies and breaking down complex technical terms for clarity.**",
  "key_points": ["Point 1", "Point 2"],
  "example": "Simple example or scenario",
  "related_terms": ["term1", "term2"],
  "code_snippet": "Relevant code snippet (if any)",
  "animation": "Short Manim visualization idea (optional)",
  "original_source_url": "URL of the documentation",
  "search_name": "Search-friendly title"
}

Only include 'animation' if it's useful.
Return valid JSON array.
"""

    for i, chunk in enumerate(doc_chunks, start=1):
        st.write(f"⚙️ Processing chunk {i}/{len(doc_chunks)}...")
        prompt_chunk = f"{prompt}\n\n{chunk}"
        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt_chunk}],
                model=model_name,
            )
            text = response.choices[0].message.content.strip()
        except Exception as e:
            st.error(f"❌ Error in chunk {i}: {e}")
            continue

        try:
            cards = json.loads(text)
        except json.JSONDecodeError:
            match = re.search(r"\[.*\]", text, re.DOTALL)
            cards = json.loads(match.group(0)) if match else [{"error": f"parse error {i}"}]

        all_cards.extend(cards)

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_cards, f, indent=2, ensure_ascii=False)

    st.success(f"✅ Generated {len(all_cards)} cards → saved to {OUTPUT_JSON}")
    return all_cards

# =====================================================
# SEND TO ENDPOINT
# =====================================================
def send_to_endpoint(cards):
    try:
        res = requests.post(ENDPOINT_URL, json={"cards": cards}, timeout=15)
        if res.status_code == 200:
            st.success("🚀 Cards successfully sent to endpoint!")
        else:
            st.error(f"❌ Failed to send cards: {res.status_code} {res.text}")
    except Exception as e:
        st.error(f"⚠️ Endpoint error: {e}")

# =====================================================
# STREAMLIT UI
# =====================================================
st.title("🧩 Motia Learning Card Generator")
st.caption("Scrape documentation → Filter → Generate Groq Cards → Send to Endpoint")

api_key = st.text_input("🔑 Enter your Groq API key:", type="password")
url = st.text_input("🌐 Documentation base URL:", value=BASE_URL)

if st.button("🚀 Run Full Pipeline"):
    if not api_key:
        st.error("Please provide your Groq API key.")
    else:
        crawl_docs(url)
        chunks = load_and_chunk_txt(SCRAPE_FILE)
        if chunks:
            cards = generate_cards(chunks, api_key)
            send_to_endpoint(cards)
