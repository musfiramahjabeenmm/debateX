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

debate_MODELS = []
moderator_MODEL = "openrouter/nvidia/nemotron-nano-9b-v2:free"

if GROQ_API_KEY:
    debate_MODELS.extend([
        "groq/openai/gpt-oss-20b",
        "groq/meta-llama/llama-4-scout-17b-16e-instruct",
    ])

if OPENROUTER_API_KEY:
    debate_MODELS.extend([
        "openrouter/z-ai/glm-4.5-air:free",
        "openrouter/nvidia/nemotron-nano-9b-v2:free",
        "openrouter/liquid/lfm-2.5-1.2b-thinking:free",
    ])
# Data directory
DATA_DIR = "data/conversations"
