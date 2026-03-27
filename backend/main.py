import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.analysis import router as analysis_router
from app.api.v1.auth import router as auth_router
from app.api.v1.candidate_profiles import router as candidate_profiles_router
from app.api.v1.recruiter_profiles import router as recruiter_profiles_router
from app.api.v1.subscriptions import router as subscriptions_router
from app.api.v1.users import router as users_router
from app.core.config import settings

app = FastAPI(title="HR Hero API", version="1.0.0", debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(candidate_profiles_router, prefix="/api/v1")
app.include_router(recruiter_profiles_router, prefix="/api/v1")
app.include_router(subscriptions_router, prefix="/api/v1")
app.include_router(analysis_router, prefix="/api/v1")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
