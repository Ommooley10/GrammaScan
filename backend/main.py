from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from language_tool_python.utils import RateLimitError

from grammar_utils import parse_sentence, dependency_check, language_tool_check
from models import SentenceRequest, SentenceResponse

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/check_grammar/", response_model=SentenceResponse)
def check_grammar(request: SentenceRequest):
    sentence = request.text
    ll1_valid = parse_sentence(sentence)
    dependency_valid = dependency_check(sentence)

    try:
        lt_errors = language_tool_check(sentence)
    except RateLimitError:
        return JSONResponse(
            status_code=429,
            content={"error": "Rate limit exceeded. Please wait a few minutes and try again."}
        )

    is_grammatically_correct = ll1_valid and dependency_valid and (len(lt_errors) == 0)

    return SentenceResponse(
        sentence=sentence,
        ll1_valid=ll1_valid,
        dependency_valid=dependency_valid,
        language_tool_issues=[e.message for e in lt_errors],
        is_grammatically_correct=is_grammatically_correct,
    )
