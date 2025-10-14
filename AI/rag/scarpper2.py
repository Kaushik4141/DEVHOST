

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
GROQ_API_KEY = ""

# =====================================================
# SESSION STATE INIT
# =====================================================
if "logs" not in st.session_state:
    st.session_state.logs = []

if "queue" not in st.session_state:
    st.session_state.queue = [BASE_URL]

if "visited" not in st.session_state:
    st.session_state.visited = set()

if "stop" not in st.session_state:
    st.session_state.stop = False

if "scraping_done" not in st.session_state:
    st.session_state.scraping_done = False

# Clear scrape file on first run
if not os.path.exists(SCRAPE_FILE):
    with open(SCRAPE_FILE, "w", encoding="utf-8") as f:
        f.write("")

# =====================================================
# SCRAPE ONE PAGE
# =====================================================
def scrape_one_page():
    if not st.session_state.queue:
        st.session_state.scraping_done = True
        st.session_state.logs.append("✅ Scraping complete")
        return

    url = st.session_state.queue.pop(0)
    if url in st.session_state.visited:
        return
    st.session_state.visited.add(url)
    st.session_state.logs.append(f"📄 Scraping: {url}")

    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        text = "\n".join([t.get_text(strip=True) for t in soup.find_all(["h1","h2","h3","p","pre","code","li"])])

        with open(SCRAPE_FILE, "a", encoding="utf-8") as f:
            f.write(f"\n\n===== {url} =====\n\n{text}\n\n")

        # Add new links to the queue
        for link in soup.find_all("a", href=True):
            full_link = urljoin(url, link["href"])
            if full_link.startswith(BASE_URL) and full_link not in st.session_state.visited:
                st.session_state.queue.append(full_link)

    except Exception as e:
        st.session_state.logs.append(f"❌ Failed {url}: {e}")

# =====================================================
# POLARS PREPROCESSING
# =====================================================
def load_and_chunk_txt(txt_path, chunk_size_chars=3000):
    with open(txt_path, "r", encoding="utf-8") as f:
        raw = f.read()

    pages = re.findall(r"===== (.*?) =====\s*\n(.*?)(?=\n===== |$)", raw, re.DOTALL)
    if not pages:
        st.warning("No pages found in scraped file.")
        return []

    df = pl.DataFrame(pages, schema=["url", "content"])
    df = df.with_columns([pl.col("content").str.replace_all(r"\s+", " ").alias("content_clean")])
    df = df.filter(pl.col("content_clean").str.len_chars() > 500)

    main_keywords = [
        "overview", "introduction", "concept", "guide", "tutorial",
        "architecture", "usage", "examples", "api", "reference", "core", "expression"
    ]
    df = df.filter(pl.any_horizontal([pl.col("url").str.contains(k, case=False) for k in main_keywords]))
    if df.height == 0:
        df = pl.DataFrame(pages, schema=["url", "content"])

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

    return chunks

# =====================================================
# GROQ MODEL CALL
# =====================================================
def generate_cards(doc_chunks):
    client = Groq(api_key=GROQ_API_KEY)
    all_cards = []
    model_name = "llama-3.3-70b-versatile"

    prompt = """
You are an AI assistant that converts technical documentation into structured learning cards.
Each card must follow this structure:

{
  "title": "Concept or Feature Name",
  "explanation": "Beginner-friendly explanation",
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
st.title("🧠 Motia Documentation → Learning Cards")
st.caption("Scraping runs automatically. Use Stop button to interrupt scraping.")

# Stop button
if st.button("🛑 Stop Scraping"):
    st.session_state.stop = True

# Automatically scrape one page per rerun
if not st.session_state.stop and not st.session_state.scraping_done and st.session_state.queue:
    scrape_one_page()
    st.experimental_rerun = lambda: None  # bypass deprecated rerun

# Display logs
st.subheader("📄 Scraping Logs")
st.text("\n".join(st.session_state.logs))

# After scraping completes, automatically generate cards
if st.session_state.scraping_done:
    chunks = load_and_chunk_txt(SCRAPE_FILE)
    if chunks:
        cards = generate_cards(chunks)
        send_to_endpoint(cards)
        st.session_state.scraping_done = False  # prevent re-run
