# DebateX Changelog & Commit History

This document outlines the complete evolutionary history of the DebateX repository, detailing the architectural decisions, refactors, and feature implementations made in every commit.

---

### `b7825c6` docs: update setup commands and improve formatting
* **What changed:** Updated the `README.md` to reflect proper setup instructions and execution commands.
* **Details:** Adjusted the backend execution port from `8000` to `8001`, provided accurate instructions for running the backend natively from the project root (`python -m backend.main`), and fixed formatting and repository clone URLs.

### `c8acad0` fix(core): resolve environment loading and startup configuration
* **What changed:** Resolved port collisions and environment parsing issues.
* **Details:** Updated `backend/config.py` to use `find_dotenv()` ensuring the root `.env` file is loaded correctly regardless of execution path. Explicitly bound the Uvicorn execution to port `8001` in the `__main__` block to avoid collisions with the frontend dev server. Restored relative imports in backend modules.

### `500beed` feat(models): implement resilient query logic and update to premium free models
* **What changed:** Built resiliency against API rate limits and upgraded the OpenRouter model suite.
* **Details:** 
  * Removed immediate exception raising in `backend/openrouter.py`, preventing a single `429 Too Many Requests` response from crashing the entire parallel debate.
  * Added fallback reasoning text extraction (checking `reasoning` and `thought`) for newer reasoning models.
  * Overhauled `backend/config.py` to use a curated mix of top-tier free models (`glm-4.5-air`, `lfm-2.5-1.2b`, `nemotron-3-nano`, `llama-3.3-70b`).
  * Assigned the highly-available `z-ai/glm-4.5-air:free` model as the Chairman/Moderator to ensure reliable Stage 3 synthesis.

### `dbf4b01` feat: implement multi-model debate engine and FastAPI server with SSE streaming endpoints
* **What changed:** Core backend deliberation pipeline implementation.
* **Details:** Added `backend/debate.py` containing the logic for the 3-stage deliberation pipeline (collect, review, synthesize). Added `backend/main.py` configuring a FastAPI server with Server-Sent Events (SSE) streaming capabilities to instantly pipe LLM reasoning down to the client.

### `e8e26a1` build: add root gitignore and backend storage/client gateway infrastructure
* **What changed:** Foundation of backend infrastructure.
* **Details:** Created `backend/openrouter.py` to handle async LLM gateway logic and parallel execution. Established `backend/storage.py` for persistent, JSON-based file storage of conversation histories. Defined global configurations in `backend/config.py`.

### `7a31667` feat: implement modular deliberation dashboard, de-anonymized peer rankings, and SSE streaming integration
* **What changed:** Complete construction of the React frontend application.
* **Details:** Built the UI from scratch containing components for `Sidebar`, `ChatInterface`, and the 3 distinct evaluation stages (`Stage1`, `Stage2`, `Stage3`). Implemented real-time SSE parsing and state management in `api.js` to render streaming responses dynamically.

### `993eff7` build: configure Vite setup, single page app setup, and updated package dependencies
* **What changed:** Scaffolded a clean Vite + React + Tailwind setup.
* **Details:** Reconfigured the frontend as a Single Page Application (SPA). Regenerated `package.json`, `index.html`, and `vite.config.js` to support the new lightweight frontend architecture.

### `99b8dc8` cleanup: remove vestigial Next.js boilerplate and configuration
* **What changed:** Architectural pivot away from Next.js.
* **Details:** Deleted all prior experimental Next.js boilerplate, routing logic (`app/`), and heavy configuration files to make way for the faster, simpler React + Vite SPA.

### `c1ce425` Remove gitignore files
* **What changed:** Temporary cleanup of git tracking configurations.

### `2b1d6f7` Add root .gitignore (and Next.js foundation)
* **What changed:** The original boilerplate scaffold.
* **Details:** Initial massive push of the early Next.js experiment codebase, establishing the first UI component ideas (`AuthCard`, `Sidebar`, `CouncilPanel`) before the architecture pivot.

### `1f28da0` Initialize README.md with project details
* **What changed:** Project inception documentation.
* **Details:** Authored the comprehensive `README.md` defining the 3-stage architecture, the core design decisions, the tech stack rationale, and the vision for a self-hosted multi-LLM deliberation system.

### `c2a4575` Initial commit
* **What changed:** Repository creation.
* **Details:** Base initialization of the repository with the MIT `LICENSE`.
