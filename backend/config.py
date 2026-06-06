"""Configuration for the DebateX."""

import os
from dotenv import load_dotenv

load_dotenv()

# API keys
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# API endpoints
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Use only Groq models
debate_MODELS = []
moderator_MODEL = ""

if GROQ_API_KEY:
    debate_MODELS = [
        "groq/openai/gpt-oss-20b",
        "groq/meta-llama/llama-4-scout-17b-16e-instruct",
    ]
    moderator_MODEL = "groq/llama-3.3-70b-versatile"
# Data directory
DATA_DIR = "data/conversations"
