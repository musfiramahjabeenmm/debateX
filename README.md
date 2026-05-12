<div align="center">

# ⚖️ debateX

**Multi-model deliberation engine. Ask once. Let the council decide.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![OpenRouter](https://img.shields.io/badge/Powered%20by-OpenRouter-orange)](https://openrouter.ai)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

[Overview](#overview) · [Architecture](#architecture) · [Tech Stack](#tech-stack) · [Quick Start](#quick-start) · [Configuration](#configuration) · [API Reference](#api-reference) · [Contributing](#contributing)

</div>

---

## Overview

**debateX** is a self-hosted, multi-LLM deliberation system inspired by [Andrej Karpathy's llm-council](https://github.com/karpathy/llm-council). Instead of routing your query to a single model, debateX convenes a council of LLMs — each producing an independent response, reviewing peers anonymously, and deferring to a designated Chairman for final synthesis.

The result: **higher-quality, bias-reduced answers** for complex reasoning, architectural decisions, legal analysis, and any task where a single model's blind spots matter.

```
User Query
    │
    ▼
┌───────────────────────────────────────────────────┐
│  Stage 1 — Independent Opinions                   │
│  GPT-4o · Gemini Pro · Claude Sonnet · Grok       │
└───────────────────────┬───────────────────────────┘
                        │ anonymized responses
                        ▼
┌───────────────────────────────────────────────────┐
│  Stage 2 — Anonymized Peer Review                 │
│  Each model critiques + ranks others' responses   │
└───────────────────────┬───────────────────────────┘
                        │ ranked evaluations
                        ▼
┌───────────────────────────────────────────────────┐
│  Stage 3 — Chairman Synthesis                     │
│  Designated LLM compiles the final answer         │
└───────────────────────────────────────────────────┘
```

### Why debateX?

| Single LLM | debateX Council |
|---|---|
| One perspective, one blind spot | Multiple perspectives cross-checked |
| No internal disagreement signal | Peer review surfaces contradictions |
| Hard to evaluate model quality | Aggregate rankings benchmark in real time |
| Bias baked into one training run | Anonymization neutralizes inter-model bias |

---

## Architecture

debateX uses a **three-stage deliberation pipeline** with a lightweight central orchestrator:

### Stage 1 — Independent Opinions
Query dispatched in parallel to all council members via OpenRouter. Responses collected independently — no model sees another's output at this stage.

### Stage 2 — Anonymized Peer Review
Each model receives the full set of responses with identities stripped. Models are assigned random labels (`Model A`, `Model B`, etc.) per session. Each council member ranks and critiques every response. Anonymization prevents sycophantic bias toward known providers.

### Stage 3 — Chairman Synthesis
A designated Chairman LLM (configurable) receives all Stage 1 responses, all Stage 2 reviews, and aggregate rankings. It produces a single, high-confidence final answer incorporating the strongest reasoning from the council.

### Key Design Decisions

- **Anonymization is architectural, not optional.** Identity masking happens in the orchestrator, not via prompt instructions.
- **Rankings aggregate statistically.** `calculate_aggregate_rankings()` computes average rank position across all peer evaluations, not just majority vote.
- **Metadata is ephemeral.** `label_to_model` mappings and `aggregate_rankings` are returned via API only — never written to storage.
- **Zero agent framework dependency.** No LangChain, CrewAI, or AutoGen. Pure Python orchestration + direct API calls.

---

## Tech Stack

### Recommended Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Backend** | Python 3.11+ · FastAPI | Async-native, OpenAPI docs free, type-safe with Pydantic |
| **LLM Gateway** | OpenRouter | Single key → GPT, Claude, Gemini, Grok, Mistral, Llama |
| **Frontend** | React 18 · TypeScript · Vite | Fast HMR, component isolation, tab-based council UI |
| **Styling** | Tailwind CSS | Zero-config utility classes, dark mode trivial |
| **Package Mgmt** | `uv` (Python) · `npm` (JS) | `uv` dramatically faster than pip for local dev |
| **Persistence** | SQLite (default) · PostgreSQL (scale) | Conversation history; `metadata` fields stay in-memory only |
| **Deployment** | Docker Compose | Single command spin-up, reproducible across machines |
| **Process Mgr** | Uvicorn + Gunicorn | Production ASGI with worker control |

### Runtime Requirements

```
Python  ≥ 3.11
Node.js ≥ 20 LTS
npm     ≥ 10
uv      (recommended) — pip install uv
```

### Key Dependencies

```
# Backend
fastapi
uvicorn[standard]
httpx          # async OpenRouter calls
pydantic-settings
python-dotenv

# Frontend
react / react-dom
typescript
vite
tailwindcss
```

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/debateX.git
cd debateX
```

### 2. Environment

```bash
cp .env.example .env
```

Open `.env` and set your OpenRouter API key:

```env
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxx
```

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys). OpenRouter provides unified access to all major providers under one credential.

### 3. Backend

```bash
# Install uv (fast Python package manager)
pip install uv

# Install dependencies and run
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000`  
Docs at `http://localhost:8000/docs`

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`

### Docker (Alternative)

```bash
docker compose up --build
```

This starts backend on `:8000` and frontend on `:5173` with hot reload.

---

## Configuration

### Council Members

Edit `backend/config/council.json` to define your LLM panel:

```json
{
  "council": [
    { "id": "gpt4o",          "model": "openai/gpt-4o",               "enabled": true },
    { "id": "claude-sonnet",  "model": "anthropic/claude-sonnet-4-5", "enabled": true },
    { "id": "gemini-pro",     "model": "google/gemini-pro-1.5",       "enabled": true },
    { "id": "grok",           "model": "x-ai/grok-3",                 "enabled": true }
  ],
  "chairman": "claude-sonnet",
  "anonymize": true
}
```

Any model available on OpenRouter can be added. The `chairman` field must match an `id` in the `council` array.

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENROUTER_API_KEY` | ✅ | — | OpenRouter API key |
| `CHAIRMAN_MODEL` | ❌ | config value | Override chairman at runtime |
| `MAX_COUNCIL_MEMBERS` | ❌ | `6` | Cap parallel requests |
| `STAGE2_TIMEOUT_SECONDS` | ❌ | `60` | Peer review timeout |
| `ENABLE_HISTORY` | ❌ | `true` | Persist conversations to DB |
| `DATABASE_URL` | ❌ | `sqlite:///./debatex.db` | Override with Postgres URL |
| `CORS_ORIGINS` | ❌ | `http://localhost:5173` | Comma-separated allowed origins |

---

## API Reference

### POST `/api/query`

Submit a query to the full three-stage council pipeline.

**Request**
```json
{
  "query": "What are the trade-offs between microservices and monoliths for a team of 5?",
  "council_override": ["gpt4o", "claude-sonnet"],   // optional: subset of council
  "stream": false
}
```

**Response**
```json
{
  "session_id": "uuid",
  "stage1": [
    { "label": "Model A", "response": "..." },
    { "label": "Model B", "response": "..." }
  ],
  "stage2": [
    { "reviewer": "Model A", "rankings": [2, 1], "critique": "..." }
  ],
  "aggregate_rankings": { "Model A": 1.5, "Model B": 1.5 },
  "final_response": "...",
  "chairman_model": "anthropic/claude-sonnet-4-5",
  "latency_ms": 8420
}
```

### GET `/api/council`

Returns current council configuration and model availability.

### GET `/api/history`

Returns paginated conversation history (requires `ENABLE_HISTORY=true`).

### DELETE `/api/history/{session_id}`

Purges a specific session from storage.

---

## Project Structure

```
debateX/
├── backend/
│   ├── main.py                  # FastAPI app entrypoint
│   ├── config/
│   │   └── council.json         # Council member definitions
│   ├── core/
│   │   ├── orchestrator.py      # 3-stage pipeline controller
│   │   ├── anonymizer.py        # Label-to-model mapping
│   │   └── ranker.py            # Aggregate ranking calculation
│   ├── routers/
│   │   ├── query.py
│   │   └── history.py
│   └── models/
│       └── schemas.py           # Pydantic request/response models
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CouncilTabs.tsx  # Stage 1 tab view
│   │   │   ├── ReviewPanel.tsx  # Stage 2 peer reviews
│   │   │   └── FinalAnswer.tsx  # Stage 3 chairman output
│   │   └── App.tsx
│   └── vite.config.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Development

### Run Tests

```bash
# Backend
cd backend
uv run pytest tests/ -v

# Frontend
cd frontend
npm run test
```

### Linting

```bash
# Backend
uv run ruff check . && uv run mypy .

# Frontend
npm run lint
```

### Adding a New Council Member

1. Add the model to `backend/config/council.json`
2. Verify the model string at [openrouter.ai/models](https://openrouter.ai/models)
3. Restart backend — no code changes required

---

## Cost Considerations

debateX multiplies inference cost by the number of council members across three stages. For a 4-member council:

| Stage | Calls | Notes |
|---|---|---|
| Stage 1 | 4 | Parallel, one per member |
| Stage 2 | 4 | Each reviews all Stage 1 responses |
| Stage 3 | 1 | Chairman only |
| **Total** | **~9** | Per user query |

Use smaller/cheaper models (Haiku, Flash, Mistral Nemo) in the council and reserve a large model for the Chairman to optimize cost-quality tradeoff.

---

## Roadmap

- [ ] Streaming support for Stage 3 chairman response
- [ ] Configurable Stage 2 review prompts per domain (legal, medical, code)
- [ ] Cost estimator before query submission
- [ ] Session comparison — diff two council runs side by side
- [ ] Plugin system for custom post-processing hooks
- [ ] Export council transcripts as Markdown / PDF

---

## Contributing

PRs welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening one.

```bash
# Standard fork-and-PR flow
git checkout -b feat/your-feature
git commit -m "feat: describe your change"
git push origin feat/your-feature
# Open PR against main
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).  
Issues: use the provided templates for bugs and feature requests.

---

## License

[MIT](LICENSE) — fork freely, build commercially, attribute appreciated.

---

## Acknowledgements

Built on the conceptual foundation of [Andrej Karpathy's llm-council](https://github.com/karpathy/llm-council).  
Powered by [OpenRouter](https://openrouter.ai) for unified multi-provider LLM access.

---

<div align="center">

**debateX** — because one model is a monologue. A council is a verdict.

</div>
