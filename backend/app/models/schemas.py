from pydantic import BaseModel
from typing import List


class JobData(BaseModel):
    job_title: str
    job_description: str


class CVAnalysis(BaseModel):
    filename: str
    candidate_name: str
    match_score: str
    missing_skills: List[str]
    reasoning: str
