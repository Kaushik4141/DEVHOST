from groq import Groq

# Replace with your API key
api_key = input("Enter your Groq API key: ").strip()
client = Groq(api_key=api_key)

# Test model
model_name = "llama-3.3-70b-versatile"  # Replace with your chosen model

try:
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": "Hello, can you respond with a simple greeting?"}],
        model=model_name
    )
    # Access the content
    print("✅ Model works! Response:")
    print(response.choices[0].message.content)
except Exception as e:
    print("❌ Model test failed:", e)
