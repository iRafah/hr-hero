import json
import tiktoken
from openai import OpenAI

from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

_FUNCTIONS = [
    {
        "name": "analyse_cv",
        "description": "Analyse a CV against a job description and return structured results.",
        "parameters": {
            "type": "object",
            "properties": {
                "match_score": {"type": "string"},
                "missing_skills": {
                    "type": "array",
                    "items": {"type": "string"},
                },
                "reasoning": {"type": "string"},
                "candidate_name": {"type": "string"},
            },
            "required": ["match_score", "missing_skills", "reasoning", "candidate_name"],
        },
    }
]

_SYSTEM_PROMPT = (
    "You are a Human Resource assistant. Your role is to objectively analyse candidate "
    "Curriculum Vitae (CV) and compare them to job descriptions to assess alignment."
)

_USER_PROMPT_TEMPLATE = (
    "Job Description:\n{job_desc}\n\n"
    "Candidate CV:\n{cv_text}\n\n"
    "Please analyse the CV against the job description and return the following:\n"
    "1. A match score from 0% to 100% estimating how well the CV aligns with the job requirements.\n"
    "2. Up to 5 missing or weak skills/knowledge areas, if any, prioritized by relevance.\n"
    "3. A brief explanation of your assessment and reasoning.\n"
    "4. Extract the candidate's full name from the CV.\n\n"
    "Guidelines:\n"
    "- If the CV mentions a skill in general terms and the job provides more specific context, treat it as a match.\n"
    "- If the input does not resemble a real CV, return a match score of 0% and explain why."
)


def _truncate_text(text: str, max_tokens: int) -> str:
    """Truncate text to a maximum number of tokens using tiktoken."""
    if not isinstance(text, str):
        text = str(text) if text is not None else ""

    encoding = tiktoken.encoding_for_model(settings.OPENAI_MODEL)
    tokens = encoding.encode(text)
    if len(tokens) > max_tokens:
        tokens = tokens[:max_tokens]
    return encoding.decode(tokens)


async def analyse_cv(cv_text: str, job_desc: str) -> dict:
    """Analyse a CV against a job description and return a structured result dict."""
    truncated_job = _truncate_text(job_desc, settings.MAX_JOB_TOKENS)
    truncated_cv = _truncate_text(cv_text, settings.MAX_CV_TOKENS)

    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {
                "role": "user",
                "content": _USER_PROMPT_TEMPLATE.format(
                    job_desc=truncated_job,
                    cv_text=truncated_cv,
                ),
            },
        ],
        functions=_FUNCTIONS,
        function_call={"name": "analyse_cv"},
        temperature=0.3,
        max_tokens=4_096,
    )

    message = response.choices[0].message

    if message.function_call is None:
        raise RuntimeError("Model did not return a function_call. Full message: " + str(message))

    return json.loads(message.function_call.arguments)
