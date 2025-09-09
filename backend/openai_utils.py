import tiktoken
import os

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

functions = [
    {
        "name": "analyze_cv",
        "description": "Analyze a CV and job description",
        "parameters": {
            "type": "object",
            "properties": {
                "match_score": {
                    "type": "string"
                },
                "missing_skills": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "reasoning": { "type": "string"}
            },
            "required": ["match_score", "missing_skills", "reasoning"]
        }
    }
]

def truncate_text(text, max_tokens: int = 3000, model="gpt-4-turbo"):
    """
    Safely truncate text to a maximum number of tokens using tiktoken.
    Ensures that input is always a string.
    """
    # Ensure input is string
    if not isinstance(text, str):
        text = str(text) if text is not None else ""

    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)
    if len(tokens) > max_tokens:
        tokens = tokens[:max_tokens]
    return encoding.decode(tokens)

# Main function to analyze CV using ChatGPT
async def agent_analyze_cv(cv_text, job_desc, model="gpt-4-turbo"):

    # Truncate for safety
    job_description = truncate_text(job_desc)
    cv_description = truncate_text(cv_text)

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI HR assistant. Your role is to objectively analyze candidate CVs "
                    "and compare them to job descriptions to assess alignment."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Job Description:\n{job_description}\n\n"
                    f"Candidate CV:\n{cv_description}\n\n"
                    "Please analyze the CV against the job description and return the following:\n"
                    "1. A match score from 0% to 100% estimating how well the CV aligns with the job requirements.\n"
                    "2. Up to 5 missing or weak skills/knowledge areas, if any, prioritized by relevance to the job.\n"
                    "3. A brief explanation of your assessment and reasoning.\n\n"
                    "Guidelines:\n"
                    "- If the CV mentions a skill in general terms and the job description provides more specific context, consider it a match. For example, if the CV mentions 'English' and the job requires 'Fluent in English', treat it as a match.\n"
                    "- This approach ensures the company can evaluate the depth themselves and avoids penalizing the candidate unfairly.\n"
                    "- If the input does not resemble a real CV, return a match score of 0% and explain why."
                )
            }
        ],
        functions=functions,
        function_call="auto",
        temperature=0.2,
        max_tokens=4_096
    )

    # Extract and return just the response content
    return response.choices[0].message.function_call.arguments