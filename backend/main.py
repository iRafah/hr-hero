import uvicorn
import docx
import tempfile
import json
import asyncio

from openai_utils import agent_analyse_cv
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from fastapi.responses import JSONResponse
from typing import List



app = FastAPI(debug=True)
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class JobData(BaseModel):
    job_title: str
    job_description: str

# --- PARSERS ---
async def extract_text_from_pdf(path: str) -> str:
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

async def extract_text_from_docx(path: str) -> str:
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])

@app.post("/analyse-single-cv")
async def analyse_cv(
    job_title: str = Form(...),
    job_description: str = Form(...),
    cv_file: UploadFile = File(...)
):
    # Validate the job data
    job_data = JobData(job_title=job_title, job_description=job_description)
    job_description = "\n".join([job_data.job_title, job_data.job_description])
    
    # Save temporarily to process
    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{cv_file.filename}") as tmp:
        contents = await cv_file.read()
        tmp.write(contents)
        file_path = tmp.name

    # Extract data
    if cv_file.filename.endswith(".pdf"):
        cv_text = await extract_text_from_pdf(file_path)
    elif cv_file.filename.endswith(".docx"):
        cv_text = await extract_text_from_docx(file_path)
    else:
        return "File extension not allowed. Upload a PDF or DOCX file"
    
    result = await agent_analyse_cv(cv_text=cv_text, job_desc=job_description)
    
    if isinstance(result, str):
        result = json.loads(result)
        result["filename"] = cv_file.filename
    return JSONResponse(content=[result])

    # For demonstration purposes, return a mock response instead of actual analysis
    # mock_response = {
    #     "match_score": '85%',
    #     "missing_skills": ["React", "GraphQL", "CI/CD"],
    #     "reasoning": "The candidate has strong Drupal and PHP skills but lacks modern frontend and DevOps experience.",
    #     "candidate_name": "Alex Johnson"
    # }
    
    # return JSONResponse(content=[mock_response])

@app.post("/analyse-multiple-cvs")
async def analyse_multiple_cvs(
    job_title: str = Form(...),
    job_description: str = Form(...),
    cv_files: List[UploadFile] = None,
):
    if not cv_files:
        return JSONResponse(content={"error": "No CV files uploaded."}, status_code=400)

    results = []

    # Process each CV concurrently for efficiency
    async def process_cv(file):
        text = (await file.read()).decode('utf-8', errors='ignore')
        analysis = await agent_analyse_cv(cv_text=text, job_desc=job_description)
        parsed = json.loads(analysis) if isinstance(analysis, str) else analysis

        return {
            "filename": file.filename,
            "match_score": parsed.get("match_score"),
            "missing_skills": parsed.get("missing_skills", []),
            "reasoning": parsed.get("reasoning", ""),
            "candidate_name": parsed.get("candidate_name", "")
        }
    
    tasks = await asyncio.gather(*[process_cv(file) for file in cv_files])

    # Sort by match_score descending (best first)
    sorted_results = sorted(
        tasks,
        key=lambda x: x.get("match_score", "0%").rstrip('%'),
        reverse=True
    )

    return {"results": sorted_results}

    # mock_multiple_response = [
    #     {
    #         "filename": "candidate_1.pdf",
    #         "candidate_name": "Rafael Santos",
    #         "match_score": "72%",
    #         "missing_skills": [],
    #         "reasoning": "The candidate meets all technical and soft skill requirements. Strong alignment with the job description and no key skill gaps identified."
    #     },
    #     {
    #         "filename": "candidate_2.docx",
    #         "candidate_name": "Maria Garcia",
    #         "match_score": "78%",
    #         "missing_skills": ["Docker", "Kubernetes"],
    #         "reasoning": "The candidate demonstrates solid PHP and Drupal knowledge but lacks containerisation experience required for deployment workflows."
    #     },
    #     {
    #         "filename": "candidate_3.pdf",
    #         "candidate_name": "John Doe",
    #         "match_score": "94%",
    #         "missing_skills": ["React", "REST APIs", "Unit Testing"],
    #         "reasoning": "While the candidate has backend experience, they are missing several essential frontend and testing skills mentioned in the job description."
    #     },
    #     {
    #         "filename": "candidate_4.docx",
    #         "candidate_name": "Jane Smith",
    #         "match_score": "47%",
    #         "missing_skills": ["Drupal", "PHP", "Git", "CI/CD"],
    #         "reasoning": "The candidate has general tech experience but lacks core requirements for the role. Significant skill gaps detected."
    #     }
    # ]

    
    # return JSONResponse(content=mock_multiple_response)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)