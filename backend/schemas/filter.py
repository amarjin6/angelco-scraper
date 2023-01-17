from pydantic import BaseModel


class FilterItem(BaseModel):
    job_type: str
    job_title: str
    location: str | None
    salary: list | None
    equity: list | None
    currencies: str | None = None
    skills: str | None = None
    markets: str | None = None
    included_keywords: str | None = None
    excluded_keywords: str | None = None
    company_size: list | None
    investment_stage: list | None
