import sys
sys.setrecursionlimit(10000)

import spacy
import language_tool_python
from language_tool_python.utils import RateLimitError

# Load NLP tools
nlp = spacy.load("en_core_web_sm")
tool = language_tool_python.LanguageToolPublicAPI('en-US')

# --- CFG GRAMMAR RULES ---
grammar_rules = {
    "S": [["NP", "VP"], ["AUX", "NP", "VP"], ["WH", "AUX", "NP", "VP"],
          ["NP", "AUX", "ADJP"], ["NP", "AUX", "VP"], ["NP", "VP", "."],
          ["NP", "AUX", "VP", "PP"], ["NP", "VP", "PP"], ["PRP", "AUX", "ADJP"],
          ["DT", "AUX", "NP"], ["DT", "AUX", "ADJP"], ["WH", "AUX", "NP", "?"]],
    "NP": [["DT", "NN"], ["DT", "JJ", "NN"], ["NN"], ["DT", "NN", "PP"],
           ["NNP"], ["PRP"], ["DT", "NNP"], ["DT", "PRP"]],
    "VP": [["VB", "NP"], ["VB", "PP"], ["VB", "TO", "VB"], ["VB"],
           ["AUX", "VB", "NP"], ["AUX", "ADJP"], ["VB", "ADJP"]],
    "PP": [["IN", "NP"]],
    "WH": [["WP"], ["WRB"]],
    "ADJP": [["JJ"], ["RB", "JJ"], ["ADVP", "JJ"]],
    ".": [["."]],
    "?": [["?"]]
}

def get_token_category(token):
    if token.text in [".", "?"]:
        return token.text
    if token.dep_ == "aux":
        return "AUX"
    pos_mapping = {
        "PRP": "PRP", "DT": "DT", "JJ": "JJ", "RB": "RB",
        "NN": "NN", "NNS": "NN", "NNP": "NNP", "VB": "VB",
        "VBD": "VB", "VBG": "VB", "VBN": "VB", "VBP": "VB",
        "VBZ": "VB", "MD": "AUX", "IN": "IN", "TO": "TO",
        "WP": "WP", "WRB": "WRB"
    }
    return pos_mapping.get(token.tag_, None)

def parse_symbol(symbol, tokens, index, memo):
    key = (symbol, index)
    if key in memo:
        return memo[key]
    if symbol not in grammar_rules:
        if index < len(tokens) and tokens[index] == symbol:
            memo[key] = index + 1
            return index + 1
        return None
    for production in grammar_rules[symbol]:
        new_index = index
        success = True
        for sym in production:
            res = parse_symbol(sym, tokens, new_index, memo)  # <-- FIXED: added tokens argument
            if res is None:
                success = False
                break
            new_index = res
        if success:
            memo[key] = new_index
            return new_index
    return None

def parse_sentence(sentence):
    doc = nlp(sentence)
    tokens = [get_token_category(token) for token in doc if get_token_category(token)]
    memo = {}
    result = parse_symbol("S", tokens, 0, memo)
    return result is not None and result == len(tokens)

def dependency_check(sentence):
    doc = nlp(sentence)
    has_subject = any(token.dep_ in ("nsubj", "nsubjpass") for token in doc)
    has_verb = any(token.pos_ in ("VERB", "AUX") for token in doc)
    missing_prepositions = []
    verbs_requiring_prep = {"go", "arrive", "return", "travel", "listen", "depend", "believe"}
    for token in doc:
        if token.pos_ == "VERB" and token.lemma_.lower() in verbs_requiring_prep:
            dobj = [child for child in token.children if child.dep_ == "dobj"]
            prep = [child for child in token.children if child.dep_ == "prep"]
            if dobj and not prep:
                missing_prepositions.append((token.text, dobj[0].text))
    return has_subject and has_verb and not missing_prepositions

def language_tool_check(sentence):
    try:
        return tool.check(sentence)
    except RateLimitError:
        raise RateLimitError("Rate limit exceeded. Please wait and try again.")
