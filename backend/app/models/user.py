import uuid
from datetime import datetime, date

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base

# Shared enum types — defined once so PostgreSQL only creates each type once
_seniority_level = Enum("junior", "mid", "senior", "lead", "specialist", name="seniority_level")
_company_size = Enum("1-10", "11-50", "51-200", "200+", name="company_size")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum("admin", "candidate", "recruiter", name="user_role"), nullable=False, default="candidate")
    is_active = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    verification_token = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Personal info
    title = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)

    # Professional info
    seniority = Column(_seniority_level, nullable=True)
    years_experience = Column(Integer, nullable=True)
    current_position = Column(String(255), nullable=True)
    current_company = Column(String(255), nullable=True)

    # Skills stored as JSON arrays
    technical_skills = Column(JSON, nullable=False, default=list)
    soft_skills = Column(JSON, nullable=False, default=list)
    languages = Column(JSON, nullable=False, default=list)

    user = relationship("User", back_populates="profile")


class UserExperience(Base):
    __tablename__ = "user_experiences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)

    company = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    is_current = Column(Boolean, nullable=False, default=False)
    description = Column(Text, nullable=True)

    profile = relationship("CandidateProfile", back_populates="experiences")


class UserEducation(Base):
    __tablename__ = "user_education"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)

    institution = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=False)
    field_of_study = Column(String(255), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    description = Column(Text, nullable=True)

    profile = relationship("CandidateProfile", back_populates="education")


# ---------------------------------------------------------------------------
# Role-based profiles
# ---------------------------------------------------------------------------

class CandidateProfile(Base):
    """Profile for users with role='user' (candidates)."""

    __tablename__ = "candidate_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Personal contact
    title = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)

    # Links
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)

    # Professional info
    seniority = Column(_seniority_level, nullable=True)
    years_experience = Column(Integer, nullable=True)
    current_position = Column(String(255), nullable=True)
    current_company = Column(String(255), nullable=True)
    available_for_work = Column(Boolean, nullable=False, default=True)

    # Skills (JSON arrays)
    technical_skills = Column(JSON, nullable=False, default=list)
    soft_skills = Column(JSON, nullable=False, default=list)
    languages = Column(JSON, nullable=False, default=list)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="candidate_profile")
    experiences = relationship(
        "UserExperience", back_populates="profile", cascade="all, delete-orphan", order_by="UserExperience.start_date.desc()"
    )
    education = relationship(
        "UserEducation", back_populates="profile", cascade="all, delete-orphan", order_by="UserEducation.start_date.desc()"
    )


class Subscription(Base):
    """Stripe subscription record — one per user."""

    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    stripe_customer_id = Column(String(255), nullable=True, index=True)
    stripe_subscription_id = Column(String(255), nullable=True, unique=True, index=True)

    plan = Column(Enum("free", "pro", "business", name="subscription_plan"), nullable=False, default="free")
    status = Column(
        Enum("active", "canceled", "past_due", "trialing", "inactive", name="subscription_status"),
        nullable=False,
        default="inactive",
    )

    current_period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="subscription")


class RecruiterProfile(Base):
    """Profile for users with role='recruiter'."""

    __tablename__ = "recruiter_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    company_name = Column(String(255), nullable=True)
    company_website = Column(String(500), nullable=True)
    company_size = Column(_company_size, nullable=True)
    industry = Column(String(255), nullable=True)
    role_title = Column(String(255), nullable=True)
    hiring_volume = Column(Integer, nullable=True)
    country = Column(String(100), nullable=True)
    timezone = Column(String(100), nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="recruiter_profile")
