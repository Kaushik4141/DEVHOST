# # --- 7. MAIN APPLICATION SETUP (Flask-SocketIO) ---
# from flask import Flask, session, request
# from flask_socketio import SocketIO, emit
# from threading import Lock

# # Import your helper functions
# # Make sure these are defined somewhere in your project:
# # load_knowledge_base(), handle_simple_interaction(), retrieve_context(), generate_response_ollama
# from helpers import load_knowledge_base, handle_simple_interaction, retrieve_context, generate_response_ollama

# # Initialize Flask app
# app = Flask(__name__)
# app.config['SECRET_KEY'] = '3b86e881eeec564ea21bed77e4c0f794034ec2b670054f6e14d426844758faf0'  # Crucial for Flask-SocketIO sessions
# socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')  
# # cors_allowed_origins="*" allows connections from any frontend domain (change for production)

# # Global knowledge base loaded once at startup
# KNOWLEDGE_BASE = load_knowledge_base()
# thread_lock = Lock()

# # Simple route to serve a basic page
# @app.route('/')
# def index():
#     return "<h1>Flask RAG Chatbot Server Running! Connect via SocketIO.</h1>"

# # --- SocketIO Event Handlers ---

# @socketio.on('connect')
# def handle_connect():
#     """Handles new client connection."""
#     if not KNOWLEDGE_BASE:
#         emit('response', "ERROR: Knowledge base failed to load. Server not ready.")
#         return

#     print(f"Client connected: {request.sid}")
#     emit('response', "--- Ollama Mistral RAG Chatbot Connected ---\nReady for queries. Send your question as a 'query' event.")

# @socketio.on('query')
# def handle_rag_query(data):
#     """
#     Handles the RAG process when the client sends a 'query' event.
#     Expected data: {'message': 'Your question here'}
#     """
#     user_query = data.get('message', '').strip()
    
#     if not user_query:
#         emit('response', "Error: Please send a non-empty message.")
#         return

#     # 1. Check for simple hardcoded responses
#     simple_response = handle_simple_interaction(user_query)
#     if simple_response:
#         response = simple_response
#     else:
#         # 2. Retrieval step
#         context = retrieve_context(user_query, KNOWLEDGE_BASE)
#         # 3. Generation step
#         response = generate_response_ollama(context, user_query)
    
#     # 4. Send response back to the sender
#     emit('response', response)
#     print(f"Sent response for query: {user_query[:50]}...")

# @socketio.on('disconnect')
# def handle_disconnect():
#     """Handles client disconnection."""
#     print(f"Client disconnected: {request.sid}")

# # --- 8. RUN THE APPLICATION ---
# if __name__ == "__main__":
#     if not KNOWLEDGE_BASE:
#         print("\nFATAL ERROR: Knowledge base is empty. Cannot start server.")
#     else:
#         print("--- Flask-SocketIO RAG Chatbot Initialized ---")
#         print(f"Knowledge base loaded with {len(KNOWLEDGE_BASE)} total documents.")
#         # Run server
#         socketio.run(app, debug=True, host='0.0.0.0', port=5000)


# --- 7. MAIN APPLICATION SETUP (Standard Flask REST API) ---
from flask import Flask, request, jsonify
from threading import Lock
import json 
# Note: We keep json imported here just in case any helper function needs it for serialization, 
# although request.json and jsonify handle most of it.

# Import your helper functions
# Make sure these are defined somewhere in your project:
# load_knowledge_base(), handle_simple_interaction(), retrieve_context(), generate_response_ollama
from helpers import load_knowledge_base, handle_simple_interaction, retrieve_context, generate_response_ollama

# Initialize Flask app
app = Flask(__name__)

# Global knowledge base loaded once at startup
KNOWLEDGE_BASE = load_knowledge_base()

# Simple route to serve a basic page
@app.route('/')
def index():
    """Returns a simple status message for the base URL."""
    return jsonify({
        "status": "Flask RAG Chatbot Server Running",
        "message": "Access the RAG endpoint at POST /api/query"
    })

# --- REST API Endpoint ---

@app.route('/api/query', methods=['POST'])
def handle_rag_api_query():
    """
    Handles the RAG process via a standard POST API request.
    Expected request JSON body: {"message": "Your question here"}
    """
    
    if not KNOWLEDGE_BASE:
        return jsonify({
            "error": "Server Error", 
            "message": "Knowledge base failed to load. Server not ready."
        }), 503  # Service Unavailable

    # Get JSON data from the request body
    data = request.get_json(silent=True)
    
    if not data or 'message' not in data:
        return jsonify({
            "error": "Invalid Request", 
            "message": "Expected JSON body with 'message' field."
        }), 400 # Bad Request

    user_query = data.get('message', '').strip()
    
    if not user_query:
        return jsonify({
            "error": "Invalid Query", 
            "message": "Please send a non-empty message."
        }), 400 # Bad Request

    # 1. Check for simple hardcoded responses
    simple_response = handle_simple_interaction(user_query)
    
    if simple_response:
        final_response = simple_response
        source_context = []
        is_rag = False
    else:
        # 2. Retrieval step
        context = retrieve_context(user_query, KNOWLEDGE_BASE)
        # 3. Generation step
        final_response = generate_response_ollama(context, user_query)
        source_context = context # Assuming retrieve_context returns the context data
        is_rag = True
    
    print(f"Processed query via {'RAG' if is_rag else 'Simple Handler'}: {user_query[:50]}...")

    # 4. Return response as JSON
    return jsonify({
        "query": user_query,
        "response": final_response,
        "is_rag": is_rag,
        "context": source_context
    }), 200 # OK

# --- 8. RUN THE APPLICATION ---
if __name__ == "__main__":
    if not KNOWLEDGE_BASE:
        print("\nFATAL ERROR: Knowledge base is empty. Cannot start server.")
        # If running locally, you might want to stop execution here
    else:
        print("--- Flask REST API RAG Chatbot Initialized ---")
        print(f"Knowledge base loaded with {len(KNOWLEDGE_BASE)} total documents.")
        
        # Run standard Flask server
        # Removed SocketIO wrapper, using standard app.run()
        # Set host='0.0.0.0' for external access, port=5000 is default.
        app.run(debug=True, host='0.0.0.0', port=5000)