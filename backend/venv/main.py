from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from grammar_utils import parse_sentence, dependency_check, language_tool_check
from models import SentenceRequest, SentenceResponse
app = FastAPI()

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SentenceRequest(BaseModel):
    text: str

@app.post("/check_grammar/")
def check_grammar(request: SentenceRequest):
    sentence = request.text
    ll1_valid = parse_sentence(sentence)
    dep_valid = dependency_check(sentence)
    lt_errors = language_tool_check(sentence)
    return {
        "sentence": sentence,
        "ll1_valid": ll1_valid,
        "dependency_valid": dep_valid,
        "language_tool_issues": [e.message for e in lt_errors]
    }
