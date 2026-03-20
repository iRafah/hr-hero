import uuid
from datetime import datetime, date

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum("admin", "user", "recruiter", name="user_role"), nullable=False, default="user")
    is_active = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    verification_token = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


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
    seniority = Column(
        Enum("junior", "pleno", "senior", "lead", "especialista", name="seniority_level"),
        nullable=True,
    )
    years_experience = Column(Integer, nullable=True)
    current_position = Column(String(255), nullable=True)
    current_company = Column(String(255), nullable=True)

    # Skills stored as JSON arrays
    technical_skills = Column(JSON, nullable=False, default=list)
    soft_skills = Column(JSON, nullable=False, default=list)
    languages = Column(JSON, nullable=False, default=list)

    user = relationship("User", back_populates="profile")
    experiences = relationship(
        "UserExperience", back_populates="profile", cascade="all, delete-orphan", order_by="UserExperience.start_date.desc()"
    )
    education = relationship(
        "UserEducation", back_populates="profile", cascade="all, delete-orphan", order_by="UserEducation.start_date.desc()"
    )


class UserExperience(Base):
    __tablename__ = "user_experiences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False)

    company = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    is_current = Column(Boolean, nullable=False, default=False)
    description = Column(Text, nullable=True)

    profile = relationship("UserProfile", back_populates="experiences")


class UserEducation(Base):
    __tablename__ = "user_education"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False)

    institution = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=False)
    field_of_study = Column(String(255), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    description = Column(Text, nullable=True)

    profile = relationship("UserProfile", back_populates="education")
