import re
import tiktoken
import json # Used for cleanly formatting the output chunks
from typing import List, Dict

# --- Configuration ---
MAX_CHUNK_SIZE = 500   # Target maximum number of tokens per chunk
CHUNK_OVERLAP = 50     # Number of tokens to overlap between sequential chunks
INPUT_FILE_NAME = "actal.txt"
OUTPUT_FILE_NAME = "motia_rag.txt"

def get_tokenizer():
    """Initializes the tiktoken tokenizer."""
    try:
        return tiktoken.get_encoding("cl100k_base")
    except Exception as e:
        print(f"Error loading tiktoken. Please ensure it is installed: pip install tiktoken. Error: {e}")
        return None

def create_rag_chunks(text_content: str, tokenizer, max_size: int, overlap: int) -> List[Dict]:
    """
    Creates contextually rich RAG chunks using a two-level hierarchical approach
    (Major Page Split -> Sub-Topic Split -> Token Limit Enforcement).
    """
    if not tokenizer:
        return []

    final_chunks = []
    
    # 1. Split by Major Page Sections (the URL headers)
    major_pages = re.split(r'===== https://www\.motia\.dev/docs(.*?)\n', text_content, flags=re.DOTALL)
    
    for i in range(1, len(major_pages), 2):
        source_path = major_pages[i].strip() if major_pages[i].strip() else ""
        source_url = "https://www.motia.dev/docs" + source_path
        raw_page_content = major_pages[i + 1].strip()
        
        page_title = raw_page_content.split('\n')[0].strip() or "Motia Core Concepts"

        # 2. Split the page content into smaller Sub-Topic sections
        sub_topic_sections = re.split(r'\n{2,}', raw_page_content.strip())

        for sub_section_text in sub_topic_sections:
            if not sub_section_text.strip():
                continue
            
            sub_topic_title = sub_section_text.split('\n')[0].strip()

            tokens = tokenizer.encode(sub_section_text)
            
            # 3. Enforce Token Limit (Adaptive Splitting)
            if len(tokens) > max_size:
                current_position = 0
                chunk_index = 1
                while current_position < len(tokens):
                    chunk_tokens = tokens[current_position:current_position + max_size]
                    chunk_text = tokenizer.decode(chunk_tokens)
                    
                    final_chunks.append({
                        "source_page": page_title,
                        "source_url": source_url,
                        "chunk_topic": sub_topic_title,
                        "chunk_id": f"{sub_topic_title} (Part {chunk_index})",
                        "text": chunk_text
                    })
                    
                    current_position += max_size - overlap
                    chunk_index += 1
            else:
                final_chunks.append({
                    "source_page": page_title,
                    "source_url": source_url,
                    "chunk_topic": sub_topic_title,
                    "chunk_id": sub_topic_title,
                    "text": sub_section_text
                })
                
    return final_chunks

# --- EXECUTION AND FILE WRITING ---

# 1. Read the documentation content from your file
try:
    with open(INPUT_FILE_NAME, 'r', encoding='utf-8') as f:
        motia_docs_content = f.read()
except FileNotFoundError:
    print(f"Error: The input file '{INPUT_FILE_NAME}' was not found.")
    print("Please ensure the file is in the same directory as the script.")
    exit()

tokenizer = get_tokenizer()
if not tokenizer:
    exit()

# 2. Create the RAG chunks
rag_chunks = create_rag_chunks(motia_docs_content, tokenizer, MAX_CHUNK_SIZE, CHUNK_OVERLAP)

# 3. Write the chunks to the output file
try:
    with open(OUTPUT_FILE_NAME, 'w', encoding='utf-8') as outfile:
        # Write each chunk as a separate JSON object for easy processing later
        for chunk in rag_chunks:
            # Use JSON dump to ensure proper escaping and formatting
            outfile.write(json.dumps(chunk, indent=4))
            outfile.write("\n" + "="*80 + "\n") # Separator line
    
    print(f"\n✅ Success! All {len(rag_chunks)} RAG chunks have been written to the file: '{OUTPUT_FILE_NAME}'")
    print(f"You can find '{OUTPUT_FILE_NAME}' in the same directory as this script.")

except Exception as e:
    print(f"An error occurred while writing to the file: {e}")