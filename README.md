## 📄 HR Hero — CV Analysis Tool

AI-powered CV analysis using FastAPI, React, and the OpenAI API.

This project allows companies to analyze single or multiple CVs using a custom LLM prompt and structured outputs. The backend handles file parsing and sends CV/job description data to the OpenAI Chat Completions API. The frontend provides a simple interface to upload CVs and see ranked results.

---

### 🚀 Features
#### 🖥️ Backend (FastAPI + OpenAI)

- Analyze single or multiple CVs
- Extract match score (0–100%)
- Identify missing skills
- Provide reasoning summary
- PDF/DOCX parser
- Async multiprocessing for batch analysis
- Clean JSON output

#### 🎨 Frontend (React + Vite)

- Upload 1 or many CVs
- Show analysis results sorted by match score
- Loading indicators while processing
- Error handling
- Clean UI ready for production

📁 Project Structure
- /frontend     → React app (Vite)
- /backend      → FastAPI app with OpenAI integration
- README.md

🔧 Requirements

- Node.js 18+

- Python 3.10+

- pip

- OpenAI API key

🔐 Environment Variables
```bash
Create a .env file inside /backend:

OPENAI_API_KEY=your_openai_key_here


Make sure not to commit this file.

🖥️ Backend (FastAPI)
📌 1. Install dependencies

Inside the /backend folder:

pip install -r requirements.txt


If you are using poetry:

poetry install

📌 2. Run the FastAPI server
uvicorn main:app --reload --port 8000


Your backend will be available at:

http://localhost:8000


Docs (Swagger UI):

http://localhost:8000/docs

🎨 Frontend (React + Vite)
📌 1. Install dependencies

Inside the /frontend folder:

npm install

📌 2. Run the development server
npm run dev


Frontend runs at:

http://localhost:5173

```

## 🔗 Connecting Frontend & Backend

```bash
In /frontend/src/api.js or similar:

export default axios.create({
  baseURL: "http://localhost:8000", 
});

🤖 API Endpoints
POST /analyse-single-cv

Uploads a single CV
Returns JSON:

{
  "filename": "john_cv.pdf",
  "match_score": "82%",
  "missing_skills": ["React", "GraphQL"],
  "reasoning": "Candidate has strong PHP and Drupal experience..."
}

POST /analyse-multiple-cvs

Uploads multiple CVs
Returns sorted list of analyses:

[
  {
    "filename": "juca.pdf",
    "match_score": "91%",
    "missing_skills": [],
    "reasoning": "Excellent match for the position."
  },
  {
    "filename": "john.pdf",
    "match_score": "78%",
    "missing_skills": ["DevOps", "CI/CD"],
    "reasoning": "Strong backend experience but weaker DevOps foundation."
  }
]

🧪 Testing API Without OpenAI Cost

You can set:

MOCK_MODE=true


Then in the backend, return mock responses instead of calling OpenAI.
```

### 🛠️ Future Improvements

📌 Scoring model calibration

📌 Candidate ranking dashboard

📌 Save results to database

📌 Admin login panel