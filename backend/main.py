from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    lt_errors = language_tool_check(sentence)

    # summarize overall correctness
    is_grammatically_correct = ll1_valid and dependency_valid and (len(lt_errors) == 0)

    return SentenceResponse(
        sentence=sentence,
        ll1_valid=ll1_valid,
        dependency_valid=dependency_valid,
        language_tool_issues=[e.message for e in lt_errors],
        is_grammatically_correct=is_grammatically_correct,
    )
