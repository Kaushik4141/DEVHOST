import json
import requests
import os
from typing import List, Dict, Any

# --- 1. CONFIGURATION ---
OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "mistral" # Ensure you have pulled this model with 'ollama pull mistral'
TXT_FILE_DIRECTORY = "./knowledge_docs" # Directory where your .txt files would be located (simulated here)

# Define the JSON files to load dynamically
JSON_FILES_TO_LOAD = ["groq_cards.json", "motia_knowledge_cards.json"]


# --- 2. KNOWLEDGE BASE LOADING FUNCTIONS ---

def load_json_files(json_files: List[str]) -> List[Dict[str, Any]]:
    """Loads knowledge cards from the specified local JSON files."""
    all_cards = []
    
    for file_name in json_files:
        try:
            # NOTE: This assumes the JSON files are in the same directory as this script.
            with open(file_name, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if isinstance(data, list):
                # Add source_type and flatten the list of cards
                for card in data:
                    # Set the source type for RAG attribution
                    card['source_type'] = f"JSON Card ({file_name})" 
                    all_cards.append(card)
                print(f"Successfully loaded {len(data)} cards from {file_name}")
            else:
                print(f"Warning: JSON file '{file_name}' did not contain a list of cards.")
                
        except FileNotFoundError:
            print(f"Error: JSON file '{file_name}' not found. Skipping file.")
        except json.JSONDecodeError:
            print(f"Error: Could not decode JSON from file '{file_name}'. Check file format. Skipping file.")
        except Exception as e:
            print(f"An unexpected error occurred reading file '{file_name}': {e}")
            
    return all_cards


# --- 3. SIMULATED TEXT FILE CONTENT ---
# This simulates reading content from .txt files on your disk.

def get_simulated_txt_content() -> List[Dict[str, str]]:
    """Simulates reading content from .txt files on your disk."""
    return [
        {
            "title": "Polars Performance Tuning Guide",
            "content": "For maximum performance in Polars, always prefer the Lazy API over the Eager API when dealing with large datasets. Use `with_columns` for derived columns instead of chained operations, and ensure data types are explicitly cast for optimal memory use. Avoid large collect() calls until the final result is necessary. The column selection should be optimized by using select() early in the chain.",
            "source_type": "TXT Document"
        },
        {
            "title": "Motia Step Security Best Practices",
            "content": "All Motia Steps should validate input data before processing. Never include sensitive credentials directly in the Step code; always retrieve them securely from environment variables or a secret management service. Ensure all external API calls use authenticated and encrypted connections (HTTPS). Log only necessary, non-sensitive data for observability.",
            "source_type": "TXT Document"
        }
    ]

def load_knowledge_base() -> List[Dict[str, Any]]:
    """
    Loads and unifies all knowledge sources (JSON files and TXT documents). 
    This function is corrected to ensure 'title' is always a string.
    """
    
    # 1. Load JSON cards from files
    knowledge = load_json_files(JSON_FILES_TO_LOAD)

    # 2. Load TXT documents (using simulated content here)
    txt_documents = get_simulated_txt_content()
    knowledge.extend(txt_documents)
    
    # 3. Convert all documents to a consistent structure (for retrieval and prompt injection)
    final_knowledge_base = []
    for doc in knowledge:
        # **CORRECTION**: Ensure 'title' is always a string, defaulting to a placeholder if missing
        doc_title = doc.get('title')
        if doc_title is None:
             doc_title = 'Untitled Document'
        
        # Create a single searchable text string for better retrieval
        searchable_text = f"{doc_title} {doc.get('explanation', '') or doc.get('content', '')}"
        
        # Prepare the final string that will be sent to the LLM
        prompt_content = f"Title: {doc_title}\nSource: {doc.get('source_type')}\nContent:\n{doc.get('explanation') or doc.get('content')}"
        
        final_knowledge_base.append({
            "searchable_text": searchable_text.lower(),
            "prompt_content": prompt_content,
            "title": doc_title # This is now guaranteed to be a string
        })
    
    return final_knowledge_base


# --- 4. RETRIEVAL (RAG Component) ---

def retrieve_context(query: str, knowledge_base: List[Dict[str, Any]]) -> str:
    """
    Performs a keyword-based retrieval of relevant documents from the knowledge base.
    """
    query_lower = query.lower()
    query_words = set(query_lower.split())
    scored_docs = []

    for doc in knowledge_base:
        score = 0
        text_to_search = doc["searchable_text"]

        # Score based on how many query words are found
        for word in query_words:
            if len(word) > 2 and word in text_to_search:
                score += 1
        
        # **CORRECTION**: Since 'title' is guaranteed to be a string by load_knowledge_base, this is safe
        if query_lower in doc["title"].lower():
            score += 5

        if score > 0:
            scored_docs.append({"doc": doc, "score": score})

    # Sort by score and take the top 3 most relevant documents
    top_docs = sorted(scored_docs, key=lambda x: x["score"], reverse=True)[:3]

    if not top_docs:
        return "No specific knowledge documents found. The AI will use its general knowledge."

    # Combine the relevant documents into a single context string for the LLM
    context_string = "\n\n--- DOCUMENT END ---\n\n".join([item["doc"]["prompt_content"] for item in top_docs])
    return context_string


# --- 5. GENERATION (Ollama API Call) ---

def generate_response_ollama(context: str, user_query: str) -> str:
    """
    Sends the user query and retrieved context to the local Ollama API for grounded generation.
    """
    SYSTEM_PROMPT = (
        "You are a helpful RAG chatbot. Answer the user's question **ONLY** based on the "
        "provided Knowledge Context. If the answer is not in the context, you MUST state "
        "clearly that you cannot find the information in the provided knowledge base. "
        "Keep the response concise and use markdown formatting."
    )

    full_prompt = (
        f"Knowledge Context:\n---\n{context}\n\n---\n\n"
        f"User Question: {user_query}"
    )

    payload = {
        "model": OLLAMA_MODEL,
        "stream": False,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": full_prompt},
        ]
    }

    try:
        print(f"Calling Ollama API with model: {OLLAMA_MODEL}...")
        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=60
        )
        response.raise_for_status()

        result = response.json()
        if result and result.get("message") and result["message"].get("content"):
            return result["message"]["content"]
        return "Error: Received an unexpected response format from Ollama API."

    except requests.exceptions.ConnectionError:
        return f"API Connection Error: Could not connect to Ollama at {OLLAMA_URL}. Is Ollama running and the Mistral model available?"
    except requests.exceptions.RequestException as e:
        return f"API Request Error: Failed to generate response. Details: {e}"


# --- 6. MAIN CHAT LOOP ---

def main():
    """Main function to run the interactive chatbot."""
    KNOWLEDGE_BASE = load_knowledge_base()
    
    # Exit if no documents were loaded
    if not KNOWLEDGE_BASE:
        print("\nFATAL ERROR: The knowledge base is empty. Please ensure your JSON files exist and are correctly formatted.")
        return

    print("--- Ollama Mistral RAG Chatbot Initialized ---")
    print(f"Model: {OLLAMA_MODEL} running on local Ollama server.")
    print(f"Knowledge base loaded with {len(KNOWLEDGE_BASE)} total documents (JSON cards + TXT files).")
    print("Ask questions about Polars, Motia, or the new guide/best practices. Type 'quit' or 'exit' to end.\n")

    while True:
        try:
            user_input = input("You: ")
        except EOFError:
            break

        if user_input.lower() in ["quit", "exit"]:
            print("Chatbot closing. Goodbye!")
            break

        if not user_input.strip():
            continue

        # 1. Retrieval Step (RAG)
        context = retrieve_context(user_input, KNOWLEDGE_BASE)

        # 2. Generation Step (Call Ollama)
        response = generate_response_ollama(context, user_input)

        # 3. Display Response
        print(f"\nAI: {response}\n")

if __name__ == "__main__":
    main()
