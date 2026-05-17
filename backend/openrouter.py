"""OpenRouter API client for making LLM requests."""

import httpx
from typing import List, Dict, Any, Optional
from .config import OPENROUTER_API_KEY, OPENROUTER_API_URL


async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query a single model via OpenRouter API.

    Args:
        model: OpenRouter model identifier (e.g., "openai/gpt-4o")
        messages: List of message dicts with 'role' and 'content'
        timeout: Request timeout in seconds

    Returns:
        Response dict with 'content' and optional 'reasoning_details', or None if failed
    """
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                OPENROUTER_API_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()

            data = response.json()
            message = data['choices'][0]['message']
            content = message.get('content')
            if not content:
                # Check for alternative text fields commonly used by reasoning models
                content = message.get('reasoning') or message.get('thought')
                if not content and message.get('reasoning_details'):
                    details = message.get('reasoning_details')
                    if isinstance(details, list) and len(details) > 0:
                        content = details[0].get('text')

            return {
                'content': content,
                'reasoning_details': message.get('reasoning_details')
            }

    except httpx.HTTPStatusError as e:
        error_msg = f"HTTP Error {e.response.status_code}"
        try:
            err_json = e.response.json()
            if 'error' in err_json and 'message' in err_json['error']:
                error_msg = err_json['error']['message']
        except Exception:
            pass
        
        print(f"HTTP Error querying model {model}: {e.response.status_code} - {error_msg}")
        raise ValueError(error_msg)
    except Exception as e:
        import traceback
        print(f"Error querying model {model}: {e}")
        traceback.print_exc()
        raise e


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Query multiple models in parallel.

    Args:
        models: List of OpenRouter model identifiers
        messages: List of message dicts to send to each model

    Returns:
        Dict mapping model identifier to response dict (or None if failed)
    """
    import asyncio

    # Create tasks for all models
    tasks = [query_model(model, messages) for model in models]

    # Wait for all to complete
    responses = await asyncio.gather(*tasks, return_exceptions=True)

    # Map models to their responses (converting exceptions to None)
    mapped_responses = {}
    for model, resp in zip(models, responses):
        if isinstance(resp, Exception):
            print(f"Model {model} failed with exception: {resp}")
            mapped_responses[model] = None
        else:
            mapped_responses[model] = resp

    return mapped_responses
