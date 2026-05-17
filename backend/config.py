"""Configuration for the DebateX."""

import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# debate members - list of OpenRouter model identifiers
debate_MODELS = [
    "z-ai/glm-4.5-air:free",
    "liquid/lfm-2.5-1.2b-instruct:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
]

# moderator model - synthesizes final response
moderator_MODEL = "z-ai/glm-4.5-air:free"

# OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
