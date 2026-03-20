import asyncio
from typing import List

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse

from app.models.schemas import JobData
from app.services.analysis_service import analyse_cv
from app.utils.file_handler import extract_text, save_temp_file

router = APIRouter()


@router.post("/analyse-single-cv")
async def analyse_single_cv(
    job_title: str = Form(...),
    job_description: str = Form(...),
    cv_file: UploadFile = File(...),
):
    job_data = JobData(job_title=job_title, job_description=job_description)
    job_desc = f"{job_data.job_title}\n{job_data.job_description}"

    file_path = await save_temp_file(cv_file)

    try:
        cv_text = await extract_text(file_path, cv_file.filename)
    except ValueError as error:
        return JSONResponse(content={"error": str(error)}, status_code=400)

    result = await analyse_cv(cv_text=cv_text, job_desc=job_desc)
    result["filename"] = cv_file.filename

    return JSONResponse(content=[result])


@router.post("/analyse-multiple-cvs")
async def analyse_multiple_cvs(
    job_title: str = Form(...),
    job_description: str = Form(...),
    cv_files: List[UploadFile] = File(...),
):
    if not cv_files:
        return JSONResponse(content={"error": "No CV files uploaded."}, status_code=400)

    job_data = JobData(job_title=job_title, job_description=job_description)
    job_desc = f"{job_data.job_title}\n{job_data.job_description}"

    async def process_cv(file: UploadFile) -> dict:
        file_path = await save_temp_file(file)
        cv_text = await extract_text(file_path, file.filename)
        analysis = await analyse_cv(cv_text=cv_text, job_desc=job_desc)
        return {
            "filename": file.filename,
            "candidate_name": analysis.get("candidate_name", ""),
            "match_score": analysis.get("match_score", "0%"),
            "missing_skills": analysis.get("missing_skills", []),
            "reasoning": analysis.get("reasoning", ""),
        }

    results = await asyncio.gather(*[process_cv(file) for file in cv_files])

    sorted_results = sorted(
        results,
        key=lambda x: int("".join(c for c in str(x.get("match_score", "0%")) if c.isdigit()) or 0),
        reverse=True,
    )

    return JSONResponse(content=sorted_results)
