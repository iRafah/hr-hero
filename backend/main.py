import uvicorn
from openai_utils import agent_analyze_cv
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from pdfminer.high_level import extract_text as extract_pdf_text

app = FastAPI(debug=True)
origins = [
    "https://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- PARSERS ---
def parse_pdf(file):
    text = extract_pdf_text(file)
    return text

class JobData(BaseModel):
    job_title: str
    job_description: str

@app.post("/analyse-cv")
async def analyze_cv(
    job_title: str = Form(...),
    job_description: str = Form(...),
    cv_file: UploadFile = File(...)
):
    # Validate the job data
    job_data = JobData(job_title=job_title, job_description=job_description)
    job_description = "\n".join([job_data.job_title, job_data.job_description])

    # Extract data
    cv_text = parse_pdf(cv_file)

    returned_data = agent_analyze_cv(cv_text=cv_text, job_desc=job_description) 

    return returned_data

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)