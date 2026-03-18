import tempfile
import docx
from pypdf import PdfReader
from fastapi import UploadFile

from app.core.config import settings

async def save_temp_file(file: UploadFile) -> str:
    """Save an uploaded file to a temporary location and return the path."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp:
        contents = await file.read()
        tmp.write(contents)
        return tmp.name

async def extract_text(file_path: str, filename: str) -> str:
    """Extract plain text from a PDF or DOCX file."""
    ext = _get_extension(filename)

    if ext not in settings.ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file type '{ext}'. Upload a PDF or DOCX file.")

    if ext == ".pdf":
        return _extract_pdf(file_path)
    return _extract_docx(file_path)

def _get_extension(filename: str) -> str:
    lower = filename.lower()
    for ext in settings.ALLOWED_EXTENSIONS:
        if lower.endswith(ext):
            return ext
    return ""

def _extract_pdf(path: str) -> str:
    reader = PdfReader(path)
    return "".join(page.extract_text() or "" for page in reader.pages)

def _extract_docx(path: str) -> str:
    doc = docx.Document(path)
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
