import json
import re
import requests
from time import sleep
from collections import defaultdict
from llama_index.llms.ollama import Ollama
from typing import List, Dict

# --- CONFIG ---
# This file is created by the 1200-token chunking script
CHUNK_FILE_NAME = "nodemailer_rag.txt"
OLLAMA_BASE_URL = "http://localhost:11434"
LLM_MODEL_NAME = "mistral"
OLLAMA_CTX_SIZE = 8192
OLLAMA_TIMEOUT_SECONDS = 300
MAX_CARDS = None # Set this to an integer if you want to limit the total cards generated
OUTPUT_FILE = "nodemailer_knowledge_cards.json"
API_ENDPOINT = "https://coy-river-untaking.ngrok-free.dev/ingest"
# ----------------

def load_chunks(file_name: str) -> List[Dict]:
    """
    Loads chunks from the custom-delimited TXT file format, ensuring each item 
    is a successfully parsed JSON dictionary.
    """
    chunks = []
    chunk_delimiter = "=" * 80 # Must match the delimiter defined in the chunking script
    try:
        with open(file_name, "r", encoding="utf-8") as f:
            content = f.read()
            # Use the custom delimiter to split the JSON chunks
            json_strings = content.split(chunk_delimiter)
            
            for js in json_strings:
                js = js.strip()
                if js:
                    try:
                        # Attempt to parse the stripped string as a JSON object
                        parsed_chunk = json.loads(js)
                        
                        if isinstance(parsed_chunk, dict):
                            chunks.append(parsed_chunk)
                        else:
                            print(f"[⚠️ WARNING] Skipping non-dictionary item: {type(parsed_chunk)}")
                            
                    except json.JSONDecodeError as e:
                        print(f"[❌ JSON Decode Error] Skipping malformed chunk: {e}")
                        continue
    except FileNotFoundError:
        print(f"❌ Error: The chunk file '{file_name}' was not found.")
        exit()
        
    return chunks

def group_chunks_by_topic(chunks):
    """
    GROUPS CHUNKS BY A COMPOSITE KEY: (chunk_topic + source_url)
    This is the crucial step that consolidates all fragments of a single, large 
    topic into one unit for card generation.
    """
    grouped = defaultdict(lambda: {"text": "", "source_url": "", "chunk_topic": ""})
    for ch in chunks:
        # Use the new composite 'chunk_topic' (e.g., "SMTP Transport - SMTP Transport")
        topic = ch.get("chunk_topic", "Unknown Topic")
        source_url = ch.get("source_url", "Unknown URL")
        composite_key = f"{topic} | {source_url}"
        
        # Aggregate the text for this unique composite topic/URL
        grouped[composite_key]["text"] += "\n" + ch.get("text", "")
        grouped[composite_key]["source_url"] = source_url
        grouped[composite_key]["chunk_topic"] = topic
        
    return grouped

def setup_llm():
    """Initializes and returns the Ollama LLM client."""
    return Ollama(
        model=LLM_MODEL_NAME,
        base_url=OLLAMA_BASE_URL,
        temperature=0.2,
        request_timeout=OLLAMA_TIMEOUT_SECONDS,
        context_window=OLLAMA_CTX_SIZE
    )

def extract_code_snippets(text):
    """Extracts common command-line snippets for inclusion in the card."""
    code_lines = []
    # Looks for lines starting with common package managers or shell commands
    for line in text.splitlines():
        if re.match(r"^\s*(npx|cd|npm|pnpm|yarn|bun|curl|git|docker)", line):
            code_lines.append(line.strip())
    if code_lines:
        # Return the first 5 unique lines as a bash code block
        return "```bash\n" + "\n".join(list(set(code_lines))[:5]) + "\n```"
    return None

def chunk_text(text, max_len=2000):
    """
    Simple text chunking by length to ensure the total text passed to the LLM 
    fits the context window for generating the card.
    """
    # This function is not for RAG chunking, but for prompt-fitting.
    if len(text) < max_len:
        return [text]
        
    # Simplified splitting to avoid tokenizing a second time
    words = text.split()
    chunks = []
    current_len = 0
    current_chunk = []

    for word in words:
        if current_len + len(word) + 1 > max_len:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_len = len(word) + 1
        else:
            current_chunk.append(word)
            current_len += len(word) + 1
            
    if current_chunk:
        chunks.append(" ".join(current_chunk))
        
    return chunks

def extract_json(text):
    """Finds and extracts the first full JSON object from the LLM response."""
    # Find the outermost curly braces
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group()
    return "{}"

def generate_card(llm, topic_title, text, source_url):
    """Generates a knowledge card using the LLM based on the aggregated topic text."""
    
    # Extract code and prepare text for prompt
    code_snippet = extract_code_snippets(text)
    chunks = chunk_text(text)
    # Use only the first 2 chunks of the aggregated text to fit the prompt
    combined_text = "\n\n".join(chunks[:2]) 
    
    # Use the cleaner 'chunk_topic' for the search name
    search_name = topic_title.split(' - ')[0] if ' - ' in topic_title else topic_title
    
    prompt = f"""
You are an AI technical writer. Based ONLY on the text provided in the 'Document Content' section, create a clear, valid JSON card.

Topic: {search_name}

--- Document Content ---
{combined_text}
---

Output a single valid JSON object with these exact keys:
- title: A concise, informative title for the card (e.g., "Nodemailer SMTP Transport Setup")
- explanation: A detailed, yet easy-to-understand explanation of the topic.
- key_points: A list of 3 to 5 most important facts or usage tips.
- example: A code block or configuration snippet demonstrating usage.
- related_terms: A list of 3 to 5 related concepts from the document.
- code_snippet: {code_snippet if code_snippet else "null"}
- original_source_url: {source_url}

Output strictly valid JSON only. Do not add explanations or extra text outside the JSON object.
"""
    for attempt in range(3):
        try:
            response = llm.complete(prompt)
            resp_text = response.text.strip()
            # Try to clean and load the JSON
            card_json = json.loads(extract_json(resp_text))
            
            # Add the searchable name field
            card_json["search_name"] = search_name
            return card_json
        except json.JSONDecodeError:
            print(f"[⚠️ JSON parse failed] Retrying ({attempt+1}/3)...")
            sleep(2)
        except Exception as e:
            print(f"[❌ LLM Error] An error occurred: {e}")
            break # Exit the retry loop for non-JSON errors
    
    # Fallback card if LLM or JSON failed after retries
    return {
        "title": f"ERROR - {search_name}",
        "explanation": "Could not generate valid JSON after multiple attempts or encountered a critical error.",
        "key_points": [],
        "example": "",
        "related_terms": [],
        "code_snippet": code_snippet,
        "original_source_url": source_url,
        "search_name": search_name
    }

def post_all_cards(cards, endpoint):
    """POST all generated cards together as a single JSON array to the API endpoint."""
    if not cards:
        print("Skipping POST request: No cards generated.")
        return

    try:
        print(f"\n🚀 Posting {len(cards)} knowledge cards to API endpoint...")
        # Note: You may need to adjust the headers based on your ngrok service requirements
        response = requests.post(endpoint, json=cards, headers={"Content-Type": "application/json"})
        
        if response.status_code in (200, 201):
            print(f"✅ Successfully posted all cards ({len(cards)}) to endpoint: {endpoint}")
        else:
            print(f"❌ Failed to post cards, status code: {response.status_code}")
            print("Response body:")
            print(response.text[:500] + "...") # Print first 500 chars of response body
    except Exception as e:
        print(f"❌ Exception while posting cards: {e}")

if __name__ == "__main__":
    
    chunks = load_chunks(CHUNK_FILE_NAME)
    if not chunks:
        print("No chunks found. Please check your chunking script output. Exiting.")
        exit()

    # Grouping ensures unique cards per topic *and* source URL
    grouped = group_chunks_by_topic(chunks)
    topics = list(grouped.items())
    
    if MAX_CARDS is not None:
        topics = topics[:MAX_CARDS]

    # This number should now be much lower than 110!
    print(f"Loaded {len(chunks)} fragments, generating **{len(topics)}** unique knowledge cards.")

    # Check Ollama connection
    try:
        llm = setup_llm()
        llm.complete("Test Ollama connection.") # Simple test call
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR: Could not connect to Ollama at {OLLAMA_BASE_URL}.")
        print("Please ensure Ollama is running and the 'mistral' model is pulled.")
        print(f"Error details: {e}")
        exit()
        
    cards = []

    # Generate all cards
    for i, (composite_key, data) in enumerate(topics, 1):
        topic_title = data['chunk_topic']
        
        print(f"\n👉 Generating card {i}/{len(topics)} for topic: **{topic_title}**...")
        
        card = generate_card(llm, topic_title, data["text"], data["source_url"])
        cards.append(card)
        sleep(1) # Be kind to the LLM service

    # Save all cards locally
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(cards, f, indent=4, ensure_ascii=False)

    # POST all cards at once
    post_all_cards(cards, API_ENDPOINT)

    print(f"\n✅ All done! Successfully saved and attempted to post **{len(cards)}** cards.")