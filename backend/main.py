import uvicorn
import docx
import tempfile

from openai_utils import agent_analyze_cv
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader

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

@app.post("/analyse-cv")
async def analyze_cv(
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
    
    return await agent_analyze_cv(cv_text=cv_text, job_desc=job_description) 

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)