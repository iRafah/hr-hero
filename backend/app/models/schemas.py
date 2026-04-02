from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------
class UserRole(str, Enum):
    admin = "admin"
    candidate = "candidate"
    recruiter = "recruiter"


class SeniorityLevel(str, Enum):
    junior = "junior"
    mid = "mid"
    senior = "senior"
    lead = "lead"
    specialist = "specialist"


class CompanySize(str, Enum):
    small = "1-10"
    medium = "11-50"
    large = "51-200"
    enterprise = "200+"


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.candidate

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Senha deve ter pelo menos 8 caracteres")
        return value

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Nome completo é obrigatório")
        return value.strip()


class UserUpdate(BaseModel):
    full_name: str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Nome completo não pode ser vazio")
        return value.strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------
class ProfileUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    seniority: Optional[SeniorityLevel] = None
    years_experience: Optional[int] = None
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    technical_skills: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None
    languages: Optional[List[str]] = None


class ExperienceCreate(BaseModel):
    company: str
    position: str
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None


class ExperienceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company: str
    position: str
    start_date: date
    end_date: Optional[date]
    is_current: bool
    description: Optional[str]


class EducationCreate(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None


class EducationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    institution: str
    degree: str
    field_of_study: Optional[str]
    start_date: date
    end_date: Optional[date]
    description: Optional[str]


class ProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: Optional[str]
    location: Optional[str]
    contact_email: Optional[str]
    phone: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]
    portfolio_url: Optional[str]
    seniority: Optional[SeniorityLevel]
    years_experience: Optional[int]
    current_position: Optional[str]
    current_company: Optional[str]
    technical_skills: List[str]
    soft_skills: List[str]
    languages: List[str]


class UserWithProfileResponse(UserResponse):
    profile: Optional[ProfileResponse] = None


# ---------------------------------------------------------------------------
# Candidate Profile
# ---------------------------------------------------------------------------

class CandidateProfileUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    seniority: Optional[SeniorityLevel] = None
    years_experience: Optional[int] = None
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    available_for_work: Optional[bool] = None
    technical_skills: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None
    languages: Optional[List[str]] = None


class CandidateProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    title: Optional[str]
    location: Optional[str]
    contact_email: Optional[str]
    phone: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]
    portfolio_url: Optional[str]
    seniority: Optional[SeniorityLevel]
    years_experience: Optional[int]
    current_position: Optional[str]
    current_company: Optional[str]
    available_for_work: bool
    technical_skills: List[str]
    soft_skills: List[str]
    languages: List[str]
    experiences: List[ExperienceResponse] = []
    education: List[EducationResponse] = []
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Recruiter Profile
# ---------------------------------------------------------------------------

class RecruiterProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    company_size: Optional[CompanySize] = None
    industry: Optional[str] = None
    role_title: Optional[str] = None
    hiring_volume: Optional[int] = None
    country: Optional[str] = None
    timezone: Optional[str] = None


class RecruiterProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    company_name: Optional[str]
    company_website: Optional[str]
    company_size: Optional[CompanySize]
    industry: Optional[str]
    role_title: Optional[str]
    hiring_volume: Optional[int]
    country: Optional[str]
    timezone: Optional[str]
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Subscription
# ---------------------------------------------------------------------------

class SubscriptionPlan(str, Enum):
    free = "free"
    pro = "pro"
    business = "business"


class SubscriptionStatus(str, Enum):
    active = "active"
    canceled = "canceled"
    past_due = "past_due"
    trialing = "trialing"
    inactive = "inactive"


class CheckoutSessionRequest(BaseModel):
    plan: SubscriptionPlan

    @field_validator("plan")
    @classmethod
    def validate_paid_plan(cls, value: "SubscriptionPlan") -> "SubscriptionPlan":
        if value == SubscriptionPlan.free:
            raise ValueError("Plano gratuito não requer pagamento")
        return value


class ChangePlanRequest(BaseModel):
    plan: SubscriptionPlan

    @field_validator("plan")
    @classmethod
    def validate_paid_plan(cls, value: "SubscriptionPlan") -> "SubscriptionPlan":
        if value == SubscriptionPlan.free:
            raise ValueError("Para cancelar, use o endpoint de cancelamento")
        return value


class CheckoutSessionResponse(BaseModel):
    checkout_url: str


class PortalSessionResponse(BaseModel):
    portal_url: str


class SubscriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    plan: SubscriptionPlan
    status: SubscriptionStatus
    current_period_end: Optional[datetime] = None
    scheduled_plan: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Analysis (existing)
# ---------------------------------------------------------------------------

class JobData(BaseModel):
    job_title: str
    job_description: str


class CVAnalysis(BaseModel):
    filename: str
    candidate_name: str
    match_score: str
    missing_skills: List[str]
    reasoning: str
