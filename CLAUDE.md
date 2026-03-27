# 🧠 Project Context: AI CV Screening SaaS

This is a SaaS application that allows recruiters to:
- Upload CVs (PDF/DOCX)
- Analyse candidates using AI
- Rank candidates by job fit
- Generate insights (missing skills, reasoning, match score)

Tech stack:
- Backend: FastAPI (Python)
- Frontend: React (Vite + Tailwind)
- AI: OpenAI 
- Database: PostgreSQL 

---

# 🏗️ Architecture Rules

## Backend Structure

All backend code MUST follow this structure:

app/
  api/v1/        → API routes only (no business logic)
  services/      → business logic
  models/        → Pydantic schemas
  utils/         → helpers (file handling, etc.)
  core/          → config, settings

### Rules:
- NEVER put business logic inside API routes
- API routes should only:
  - validate input
  - call services
  - return response

---

## Service Layer Rules

- All AI logic must be inside `services/`
- Functions must be reusable and independent
- No FastAPI imports inside services

---

## File Handling

- Always use `save_temp_location()` for uploaded files
- Only allow `.pdf` and `.docx`
- Always validate file type

---

## AI Integration

- Use `agent_analyse_cv()` from `openai_utils`
- Always return structured JSON
- Never return raw strings to frontend

---

# 🎨 Frontend Architecture

Frontend uses:
- React 19
- Tailwind CSS v4 (with @theme + CSS variables)
- Tailwind Variants (tailwind-variants)
- Tailwind Merge
- Lucide React (preferred) or Phosphor Icons

---

## Folder Structure

src/
  components/
    ui/              → reusable UI components (Button, Input, Card)
    layout/          → Navbar, Sidebar
  features/
    auth/
    jobs/
    analysis/
  pages/
  hooks/
  services/          → API calls
  utils/
  styles/

---

## Component Rules

- Components must be small and reusable
- Separate UI from business logic
- No API calls inside UI components → use services/
- Use hooks for logic (useAuth, useAnalysis)

---

## Styling Rules (IMPORTANT)

- Use Tailwind ONLY (no inline CSS unless necessary)
- Use @theme for design tokens
- Use CSS variables for colors, spacing, radius

Example:

:root {
  --color-primary: 59 130 246;
}

---

## UI Variants (MANDATORY)

Use `tailwind-variants` for all components with variants.

Example:
- Button (primary, secondary, ghost)
- Input (default, error, disabled)

---

## Class Handling

- Always use `cn()` utility (clsx + tailwind-merge)
- Avoid duplicate Tailwind classes

---

## Language
- Keep all the UI labelling in Portuguese (Brazil) 
- The project will access other languages later, but for now, the focus is the Brazilian market

## Icons

- Prefer Lucide React
- Keep icon size consistent (16, 20, 24)

# 🧠 How-To: Add a New Feature

When creating a new feature, ALWAYS follow:

BACKEND:

1. Create Pydantic model (models/)
2. Create service logic (services/)
3. Create API route (api/v1/)
4. Validate input
5. Return structured JSON

FRONTEND:

1. Create feature folder (features/)
2. Create API service (services/api.ts)
3. Create hook (useFeature)
4. Create UI components
5. Add page or integrate into existing page

RULE:
- Never mix UI and business logic
- Update the README.md file with relevant information

# 🧠 How-To: Create a New Page

1. Create page in /pages
2. Add route
3. Use layout (Navbar + container)
4. Fetch data via hooks
5. Handle loading + error states

# 🧠 How-To: Call Backend API

- Use services/api.ts
- Never call fetch/axios directly inside components
- Always wrap calls in reusable functions

Example:
getAnalyses()
createJob()

# 🎨 Design System Rules

## Layout

- Max width: 1200px
- Use consistent padding (px-4 md:px-8)
- Use spacing scale (space-y-4, space-y-6)
- 

---

## Components

Must exist:
- Button
- Input
- Card
- Modal
- Table
- Badge

---

## UX Rules

- Always show loading state
- Always show empty state
- Always show error state

---

## Accessibility

- Inputs must have labels
- Buttons must have clear actions
- Use proper contrast

# 🎯 Coding Standards

## General Rules

- Use async functions where possible
- Keep functions small and focused
- Use descriptive names (no abbreviations)
- Avoid duplication

## Naming Conventions

- snake_case → Python variables/functions
- PascalCase → Pydantic models
- kebab-case → API routes

---

## Error Handling

- Always return proper JSONResponse with status codes
- Never crash the API
- Validate all inputs

---

# 📡 API Design Rules

## Endpoint naming

GOOD:
- /api/v1/analyse-single-cv
- /api/v1/analyse-multiple-cvs

BAD:
- /runAnalysis
- /doStuff

---

## Response Format

Always return:

{
  "filename": "...",
  "candidate_name": "...",
  "match_score": "...",
  "missing_skills": [],
  "reasoning": "..."
}

---

# 🔐 Security Rules

- Never expose API keys
- Never trust frontend input
- Always validate uploaded files

---

# 🚫 Things to Avoid

- No business logic in routes
- No direct DB calls in routes (future)
- No hardcoded values
- No large functions (>50 lines)

---


# ✅ Example Flow

When adding a feature:

1. Create Pydantic model (models/)
2. Add service logic (services/)
3. Add API route (api/v1/)
4. Wire everything in main.py

---

# 📌 Goal

Maintain a clean, scalable SaaS backend that can grow to production level without refactoring chaos.