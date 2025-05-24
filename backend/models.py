from pydantic import BaseModel
from typing import List

class SentenceRequest(BaseModel):
    text: str

class SentenceResponse(BaseModel):
    sentence: str
    ll1_valid: bool
    dependency_valid: bool
    language_tool_issues: List[str]
