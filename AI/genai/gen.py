# # import os
# # import json
# # import re
# # from groq import Groq

# # # --- Step 1: Get API key ---
# # groq_api_key = os.getenv("GROQ_API_KEY")

# # if not groq_api_key:
# #     groq_api_key = input("Enter your Groq API key: ").strip()

# # if not groq_api_key:
# #     raise ValueError("No Groq API key provided. Please provide a valid key.")

# # # Initialize Groq client
# # client = Groq(api_key=groq_api_key)

# # # --- Step 2: Load documentation ---
# # doc_file = "groq_docs.txt"
# # if not os.path.isfile(doc_file):
# #     print(f"Documentation file '{doc_file}' not found.")
# #     doc_file = input("Please enter the correct path to your documentation file: ").strip()

# # with open(doc_file, "r", encoding="utf-8") as f:
# #     doc_text = f.read()

# # # --- Step 3: Define the Motia-style prompt ---
# # prompt = """
# # You are an AI assistant that converts technical documentation into structured learning cards.
# # Each card must follow this structure:

# # {
# #   "title": "Concept or Feature Name",
# #   "explanation": "A beginner-friendly explanation of the concept",
# #   "key_points": [
# #     "Important point 1",
# #     "Important point 2"
# #   ],
# #   "example": "A small practical example or scenario",
# #   "related_terms": [
# #     "term1",
# #     "term2"
# #   ],
# #   "code_snippet": "Relevant code snippet (if any)",
# #   "animation": "Short Manim visualization idea (optional, only if helpful)",
# #   "original_source_url": "URL of the original documentation",
# #   "search_name": "Search-friendly title"
# # }

# # Only include the 'animation' field if it helps visualize complex concepts.
# # Output JSON for multiple cards as a single array.
# # """

# # # --- Step 4: Split documentation into chunks to avoid token limits ---
# # chunk_size = 3000  # approximate characters per chunk
# # chunks = [doc_text[i:i+chunk_size] for i in range(0, len(doc_text), chunk_size)]

# # # --- Step 5: Generate cards for each chunk ---
# # all_cards = []
# # supported_model = "llama-3.3-70b-versatile"  # replace with any supported model

# # for i, chunk in enumerate(chunks, start=1):
# #     print(f"Processing chunk {i}/{len(chunks)}...")
# #     prompt_chunk = f"{prompt}\n\n{chunk}"
    
# #     try:
# #         response = client.chat.completions.create(
# #             messages=[{"role": "user", "content": prompt_chunk}],
# #             model=supported_model
# #         )
# #         # Correctly access content from ChatCompletion object
# #         text = response.choices[0].message.content.strip()
# #     except Exception as e:
# #         print(f"Error generating content for chunk {i}: {e}")
# #         continue

# #     # --- Step 6: Parse JSON safely ---
# #     try:
# #         cards = json.loads(text)
# #     except json.JSONDecodeError:
# #         match = re.search(r"\[.*\]", text, re.DOTALL)
# #         cards = json.loads(match.group(0)) if match else [{"error": f"parse error in chunk {i}"}]

# #     all_cards.extend(cards)

# # # --- Step 7: Save all cards to JSON file ---
# # output_file = "groq_cards.json"
# # with open(output_file, "w", encoding="utf-8") as f:
# #     json.dump(all_cards, f, indent=2, ensure_ascii=False)

# # print(f"✅ Generated {len(all_cards)} Motia-style cards saved to {output_file}")


# import os
# import json
# import re
# from groq import Groq
# import sys

# # --- Step 1: Get API key ---
# groq_api_key = os.getenv("GROQ_API_KEY")

# if not groq_api_key:
#     # Use sys.stdin.fileno() check for non-interactive environments
#     if sys.stdin and sys.stdin.isatty():
#         groq_api_key = input("Enter your Groq API key: ").strip()
#     else:
#         # Cannot prompt for input, rely solely on environment variable
#         raise ValueError("No GROQ_API_KEY environment variable found, and input is not interactive.")

# if not groq_api_key:
#     raise ValueError("No Groq API key provided. Please provide a valid key.")

# # Initialize Groq client
# client = Groq(api_key=groq_api_key)

# # --- Step 2: Load documentation ---
# doc_file = "groq_docs.txt"
# if not os.path.isfile(doc_file):
#     print(f"Documentation file '{doc_file}' not found.")
#     doc_file_input = input("Please enter the correct path to your documentation file: ").strip()
#     # Update doc_file path if input was provided
#     if doc_file_input:
#         doc_file = doc_file_input

# # Final check before opening
# if not os.path.isfile(doc_file):
#     raise FileNotFoundError(f"Documentation file not found at: {doc_file}")

# with open(doc_file, "r", encoding="utf-8") as f:
#     doc_text = f.read()

# # --- Step 3: Define the Motia-style prompt (Made stricter) ---
# prompt = """
# You are an AI assistant that converts technical documentation into structured learning cards.
# ***YOUR ENTIRE RESPONSE MUST BE A SINGLE, VALID JSON ARRAY OF CARDS. DO NOT INCLUDE ANY TEXT, COMMENTS, OR MARKDOWN FORMATTING OUTSIDE OF THE JSON ARRAY.***
# Each card must follow this structure exactly:

# {
#   "title": "Concept or Feature Name",
#   "explanation": "A **detailed, comprehensive, and beginner-friendly explanation of the concept, using analogies and breaking down complex technical terms for clarity.**",",
#   "key_points": [
#     "Important point 1",
#     "Important point 2"
#   ],
#   "example": "A small practical example or scenario",
#   "related_terms": [
#     "term1",
#     "term2"
#   ],
#   "code_snippet": "Relevant code snippet (if any)",
#   "animation": "Short Manim visualization idea (optional, only if helpful)",
#   "original_source_url": "URL of the original documentation (Use a placeholder if unknown)",
#   "search_name": "Search-friendly title"
# }

# Only include the 'animation' field if it helps visualize complex concepts.
# Output JSON for multiple cards as a single array, like: [ {card1}, {card2}, ... ]
# """

# # --- Step 4: Split documentation into chunks to avoid token limits ---
# chunk_size = 3000  # approximate characters per chunk
# chunks = [doc_text[i:i+chunk_size] for i in range(0, len(doc_text), chunk_size)]

# # --- Step 5: Generate cards for each chunk ---
# all_cards = []
# # Use a model that supports JSON mode and has a large context window
# supported_model = "llama-3.3-70b-versatile" 

# for i, chunk in enumerate(chunks, start=1):
#     print(f"Processing chunk {i}/{len(chunks)}...")
    
#     # Prepend the strict prompt to the chunk content
#     prompt_chunk = f"{prompt}\n\nDocumentation Chunk:\n---\n{chunk}\n---"
    
#     try:
#         # 🎯 CRITICAL FIX: Use response_format to enforce clean JSON output
#         response = client.chat.completions.create(
#             messages=[{"role": "user", "content": prompt_chunk}],
#             model=supported_model,
#             response_format={"type": "json_object"}  # Enforce JSON object output
#         )
        
#         # Correctly access content from ChatCompletion object
#         text = response.choices[0].message.content.strip()
    
#     except Exception as e:
#         print(f"⚠️ Error generating content for chunk {i}: {e}")
#         continue

#     # --- Step 6: Parse JSON safely (Improved Error Handling) ---
#     try:
#         # 1. Try direct parsing (will work best with response_format={"type": "json_object"})
#         cards = json.loads(text)
    
#     except json.JSONDecodeError as e:
#         print(f"❌ Direct JSON parse failed for chunk {i}. Attempting fallback extraction. Error: {e}")
        
#         # 2. Fallback: Clean up common markdown wrappers and extract the JSON array [ ... ]
#         cleaned_text = text.replace("```json", "").replace("```", "").strip()
#         # Non-greedy regex to find the most likely JSON array structure
#         match = re.search(r"(\[.*?\])", cleaned_text, re.DOTALL) 

#         if match:
#             json_string = match.group(1)
#             try:
#                 # 3. Try parsing the extracted string
#                 cards = json.loads(json_string)
#             except json.JSONDecodeError as e_inner:
#                 # 4. Final failure, insert a placeholder error card
#                 print(f"❌ Fallback regex extraction also failed for chunk {i}. Error: {e_inner}")
#                 cards = [{"error": f"Critical JSON parse error in chunk {i}", 
#                           "raw_output_snippet": json_string[:100] + "..."}]
#         else:
#             # 5. Fallback if no array pattern is found
#             print(f"❌ Could not find JSON array pattern in chunk {i}'s output.")
#             cards = [{"error": f"No JSON array found in chunk {i} output", 
#                       "raw_output_snippet": text[:100] + "..."}]

#     # Ensure 'cards' is always treated as a list before extending
#     if isinstance(cards, dict):
#         # Sometimes the model returns a single object {card} instead of an array [{card}]
#         all_cards.append(cards)
#     elif isinstance(cards, list):
#         all_cards.extend(cards)
#     else:
#         print(f"⚠️ Unexpected card format in chunk {i}. Skipping.")

# # --- Step 7: Save all cards to JSON file ---
# output_file = "groq_cards.json"
# try:
#     with open(output_file, "w", encoding="utf-8") as f:
#         json.dump(all_cards, f, indent=2, ensure_ascii=False)
# except Exception as e:
#     print(f"Failed to save output file: {e}")
#     sys.exit(1)

# print(f"✅ Generated {len(all_cards)} Motia-style cards saved to {output_file}")  


import os
import json
import re
from groq import Groq
import sys
import requests # ⬅️ ADDED: Import the requests library

# --- Step 1: Get API key ---
groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    if sys.stdin and sys.stdin.isatty():
        groq_api_key = input("Enter your Groq API key: ").strip()
    else:
        raise ValueError("No GROQ_API_KEY environment variable found, and input is not interactive.")

if not groq_api_key:
    raise ValueError("No Groq API key provided. Please provide a valid key.")

# Initialize Groq client
client = Groq(api_key=groq_api_key)

# --- Step 2: Load documentation ---
doc_file = "groq_docs.txt"
if not os.path.isfile(doc_file):
    print(f"Documentation file '{doc_file}' not found.")
    doc_file_input = input("Please enter the correct path to your documentation file: ").strip()
    if doc_file_input:
        doc_file = doc_file_input

if not os.path.isfile(doc_file):
    raise FileNotFoundError(f"Documentation file not found at: {doc_file}")

with open(doc_file, "r", encoding="utf-8") as f:
    doc_text = f.read()

# --- Step 3: Define the Motia-style prompt (Detailed Explanation) ---
prompt = """
You are an AI assistant that converts technical documentation into structured learning cards.
***YOUR ENTIRE RESPONSE MUST BE A SINGLE, VALID JSON ARRAY OF CARDS. DO NOT INCLUDE ANY TEXT, COMMENTS, OR MARKDOWN FORMATTING OUTSIDE OF THE JSON ARRAY.***
Each card must follow this structure exactly:

{
  "title": "Concept or Feature Name",
  "explanation": "A detailed, comprehensive, and beginner-friendly explanation of the concept, using analogies and breaking down complex technical terms for clarity.",
  "key_points": [
    "Important point 1",
    "Important point 2"
  ],
  "example": "A small practical example or scenario",
  "related_terms": [
    "term1",
    "term2"
  ],
  "code_snippet": "Relevant code snippet (if any)",
  "animation": "Short Manim visualization idea (optional, only if helpful)",
  "original_source_url": "URL of the original documentation (Use a placeholder if unknown)",
  "search_name": "Search-friendly title"
}

Only include the 'animation' field if it helps visualize complex concepts.
Output JSON for multiple cards as a single array, like: [ {card1}, {card2}, ... ]
"""

# --- Step 4: Split documentation into chunks to avoid token limits ---
chunk_size = 3000
chunks = [doc_text[i:i+chunk_size] for i in range(0, len(doc_text), chunk_size)]

# --- Step 5: Generate cards for each chunk ---
all_cards = []
supported_model = "llama-3.3-70b-versatile" 

for i, chunk in enumerate(chunks, start=1):
    print(f"Processing chunk {i}/{len(chunks)}...")
    
    prompt_chunk = f"{prompt}\n\nDocumentation Chunk:\n---\n{chunk}\n---"
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt_chunk}],
            model=supported_model,
            response_format={"type": "json_object"}
        )
        text = response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"⚠️ Error generating content for chunk {i}: {e}")
        continue

    # --- Step 6: Parse JSON safely ---
    cards = []
    try:
        cards = json.loads(text)
    
    except json.JSONDecodeError as e:
        print(f"❌ Direct JSON parse failed for chunk {i}. Attempting fallback extraction. Error: {e}")
        
        cleaned_text = text.replace("```json", "").replace("```", "").strip()
        match = re.search(r"(\[.*?\])", cleaned_text, re.DOTALL) 

        if match:
            json_string = match.group(1)
            try:
                cards = json.loads(json_string)
            except json.JSONDecodeError as e_inner:
                print(f"❌ Fallback regex extraction also failed for chunk {i}. Error: {e_inner}")
                cards = [{"error": f"Critical JSON parse error in chunk {i}", 
                          "raw_output_snippet": json_string[:100] + "..."}]
        else:
            print(f"❌ Could not find JSON array pattern in chunk {i}'s output.")
            cards = [{"error": f"No JSON array found in chunk {i} output", 
                      "raw_output_snippet": text[:100] + "..."}]

    if isinstance(cards, dict):
        all_cards.append(cards)
    elif isinstance(cards, list):
        all_cards.extend(cards)
    else:
        print(f"⚠️ Unexpected card format in chunk {i}. Skipping.")

# --- Step 7: Save all cards to JSON file ---
output_file = "groq_cards.json"
try:
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_cards, f, indent=2, ensure_ascii=False)
    print(f"✅ Generated {len(all_cards)} Motia-style cards saved to {output_file}")
except Exception as e:
    print(f"Failed to save output file: {e}")
    sys.exit(1)

# --- Step 8: Send JSON data to the endpoint 🚀 ---
target_url = "https://coy-river-untaking.ngrok-free.dev/ingest"
headers = {"Content-Type": "application/json"}

print(f"\nAttempting to send data to {target_url}...")

try:
    # Send the JSON data directly. json=all_cards automatically serializes the list 
    # and sets the Content-Type header (which we explicitly defined anyway).
    response = requests.post(target_url, json=all_cards, headers=headers)
    
    # Check for a successful status code (2xx)
    response.raise_for_status() 
    
    print(f"🎉 Successfully sent data to the endpoint.")
    print(f"   Response Status: {response.status_code}")
    print(f"   Response Body (Snippet): {response.text[:100]}...")

except requests.exceptions.RequestException as e:
    print(f"❌ Failed to send data to the endpoint: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"   Server responded with status code: {e.response.status_code}")
        print(f"   Server error message: {e.response.text}")
# -------------------------------------------------------------------------