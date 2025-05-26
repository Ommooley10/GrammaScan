# GrammaScan

GrammaScan is a fast, intelligent, and user-friendly grammar-checking web application. It combines the linguistic power of **spaCy** and **LanguageTool**, with a modern full-stack architecture powered by **FastAPI** and **Next.js**. In addition to grammar correction, GrammaScan features a built-in **AI assistant powered by Gemini**, offering users helpful suggestions, explanations, and language refinement tips in real time.

---

## ✨ Key Features

- ✅ Accurate grammar and spelling corrections using NLP
- 🧠 **AI Assistant** powered by **Gemini** for contextual help and guidance
- ⚡ High-performance API built with FastAPI
- 💻 Clean, accessible UI using ShadCN UI and Tailwind CSS
- 🌍 Responsive design for mobile and desktop
- 🔌 API-first design for easy integration into other apps
- ☁️ Fully deployed and accessible online

---

## 🧠 NLP & AI Technology

### spaCy
[spaCy](https://spacy.io/) is an open-source library for advanced Natural Language Processing in Python. It provides fast and efficient tokenization, part-of-speech tagging, and entity recognition, making it ideal for text pre-processing and analysis.

### language-tool-python
This is a Python wrapper for [LanguageTool](https://languagetool.org/), a rule-based grammar, style, and spell checker that supports multiple languages. It provides detailed grammar corrections and suggestions based on linguistic rules.

### Gemini AI
GrammaScan integrates **Gemini**, Google’s advanced multimodal AI model, to serve as an intelligent language assistant. Users can ask Gemini for writing advice, explanation of grammar rules, or help rewriting sentences with improved clarity and tone.

---

## 🛠 Technology Stack

| Layer       | Stack                                      |
|-------------|--------------------------------------------|
| **Frontend**| Next.js, ShadCN UI, Tailwind CSS           |
| **Backend** | FastAPI, spaCy, language-tool-python       |
| **AI**      | Gemini API (Google AI Studio / PaLM)       |
| **Deployment** | Vercel (frontend), Render (backend)     |

---

## 🌐 Live Demo

- **Frontend**: [https://gramma-scan.vercel.app/dashboard](https://gramma-scan.vercel.app/dashboard)  
- **Backend (API)**: [https://gramma-backend.onrender.com/](https://gramma-backend.onrender.com/)

---

## 🚀 Local Setup Instructions

### 🔹 Backend (FastAPI + spaCy + LanguageTool)

```bash
# Clone the repository
git clone https://github.com/yourusername/grammascan.git
cd grammascan/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn main:app --reload
```

---

## Project Structure

```bash
grammascan/
├── backend/
│   ├── main.py               # FastAPI app
│   ├── grammar_check.py      # spaCy + LanguageTool integration
│   └── requirements.txt
├── frontend/
│   ├── app/                  # Next.js pages and routing
│   ├── components/           # UI components using ShadCN
│   ├── public/
│   └── tailwind.config.ts
└── README.md
```

---

Maintained by Ommooley10
For issues, suggestions, or contributions, please open an issue or pull request.
