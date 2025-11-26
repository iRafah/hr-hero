import tiktoken
import os

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

functions = [
    {
        "name": "analyse_cv",
        "description": "Analyse a CV and job description",
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
                "reasoning": { "type": "string" },
                "candidate_name": { "type": "string" },
            },
            "required": ["match_score", "missing_skills", "reasoning", "candidate_name"]
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

# Main function to analyse CV using the GPT model
async def agent_analyse_cv(cv_text, job_desc, model="gpt-4-turbo"):

    # Truncate for safety
    job_description = truncate_text(job_desc)
    cv_description = truncate_text(cv_text)

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a Human Resource assistant. Your role is to objectively analyse candidate Curriculum Vitae (CV) "
                    "and compare them to job descriptions to assess alignment."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Job Description:\n{job_description}\n\n"
                    f"Candidate CV:\n{cv_description}\n\n"
                    "Please analyse the CV against the job description and return the following:\n"
                    "1. A match score from 0% to 100% estimating how well the CV aligns with the job requirements.\n"
                    "2. Up to 5 missing or weak skills/knowledge areas, if any, prioritized by relevance to the job.\n"
                    "3. A brief explanation of your assessment and reasoning.\n\n"
                    "4. Extract the candidate's full name from the CV.\n\n"
                    "Guidelines:\n"
                    "- If the CV mentions a skill in general terms and the job description provides more specific context, consider it a match. For example, if the CV mentions 'English' and the job requires 'Fluent in English', treat it as a match.\n"
                    "- This approach ensures the company can evaluate the depth themselves and avoids penalizing the candidate unfairly.\n"
                    "- If the input does not resemble a real CV, return a match score of 0% and explain why."
                )
            }
        ],
        functions=functions,
        function_call={ "name": "analyse_cv" },
        temperature=0.3,
        max_tokens=4_096
    )

    # Extract and return just the response content
    result = response.choices[0].message
    print("DEBUG message:", response.choices[0].message)

    if result.function_call is None:
        raise RuntimeError("Model did not return a function_call. Full message: " + str(msg))

    return result.function_call.arguments

