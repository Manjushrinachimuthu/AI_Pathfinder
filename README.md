# 🎯 AI Pathfinder — Role-Based Career Preparation Platform

> A full-stack web application that helps students and freshers prepare for placements at top MNCs with AI-powered mock tests, aptitude learning, coding practice, resume analysis, and interview preparation.

---

## 📸 Overview

AI Pathfinder is a gamified placement preparation platform built with **Flask + Vanilla JS**. It covers everything from aptitude topic learning to company-specific mock tests, coding concepts, resume building, and AI-generated interview questions.

---

## ✨ Features

### 📚 Learning Hub
- **Aptitude Topic Picker** — Glassmorphism UI with 27 topics across Quantitative, Logical, and Verbal sections
- Each topic opens a **detail view** with key formulas, concept notes, exam tips, and Easy / Medium / Hard practice questions
- Live XP counter and per-tab progress bar
- Mark topics as done with a circular checkbox

### 🏢 MNC Mock Tests
- Company-specific mock tests for **TCS, Infosys, Wipro, Accenture, Cognizant, HCL, Tech Mahindra, Capgemini, Amazon, Google, Microsoft, IBM**
- Configurable aptitude + coding question count
- Detailed results with section-wise breakdown

### 💻 Coding Practice
- Language-wise learning paths: **C, C++, Java, Python, JavaScript**
- Topic-wise concept notes with syntax examples
- Practice questions per topic at Easy / Medium / Hard levels

### 🤖 AI Mock Interview
- AI-generated **Technical** and **HR** interview questions via Groq API
- Configurable question count per round
- Chat-style answer interface

### 💼 Resume Builder + Checker
- **Build tab** — Fill in target role, summary, skills, experience, projects, education
- **Live checklist sidebar** — 8 real-time checks that update as you type
- **Analyze & Score** — Weighted 100-point ATS score with section-by-section pass/fail, priority fixes, keyword gap detection, and grade badge
- **Upload & Analyze tab** — Drag-and-drop resume upload with job description paste for deep keyword matching
- **ATS Tips tab** — 8 cards covering how ATS works, formatting, keywords, action verbs, and more

### 🗺️ System Design Module
- 7 topic areas: Design Fundamentals, Load Balancing, Caching, Database Design at Scale, Messaging, API Design, Classic Design Problems
- Each topic has 5 expandable subtopics with detailed explanations

### 🖥️ Hands-on IT Module
- 6 topic areas: Linux, Networking, Cloud Fundamentals, Docker, Git, Databases
- Each topic has 5 expandable subtopics with practical detail

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, Flask, Flask-CORS |
| AI / LLM | Groq API (LLaMA 3) |
| Frontend | Vanilla JS, HTML5, CSS3 |
| Auth & DB | Firebase (Auth + Firestore) |
| Deployment | Gunicorn + Gevent |
| Linting | Ruff |

---

## 📁 Project Structure

```
AI_Pathfinder/
├── backend/
│   ├── app.py                        # Flask app — all API routes
│   ├── requirements.txt
│   ├── .env.example                  # Environment variable template
│   └── utils/
│       ├── tcs_practice_bank.py      # TCS aptitude question bank (Easy/Medium/Hard)
│       ├── coding_concepts_bank.py   # Coding language + topic content
│       └── groq_question_generator.py# Groq AI interview question generator
├── frontend/
│   ├── index.html                    # Single-page app shell
│   ├── css/
│   │   └── style.css                 # All styles (glassmorphism, dark theme)
│   ├── js/
│   │   ├── app.js                    # All frontend logic (~6000 lines)
│   │   └── firebase-config.js        # Firebase project config
│   └── assets/
│       └── tcs-interview-process-flowchart.png
├── streamlit_app.py                  # Standalone Streamlit version
├── requirements.txt                  # Root-level deps (for Streamlit deploy)
└── runtime.txt                       # Python version pin
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- A [Groq API key](https://console.groq.com/) (free tier available)
- A Firebase project (optional — for auth and score persistence)

### 1. Clone the repo

```bash
git clone https://github.com/Manjushrinachimuthu/AI_Pathfinder.git
cd AI_Pathfinder
```

### 2. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Set up environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Configure Firebase (optional)

Edit `frontend/js/firebase-config.js` with your Firebase project credentials. Without this, the app works fully — auth and score sync are just disabled.

### 5. Run the app

```bash
python backend/app.py
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key for AI interview question generation |
| `GROQ_MODEL` | No | Override the default Groq model (default: `llama3-8b-8192`) |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/aptitude/<category>` | Aptitude questions by category (quantitative/logical/verbal) |
| GET | `/api/tcs/aptitude/<topic>?difficulty=easy` | TCS topic questions by difficulty |
| GET | `/api/tcs/aptitude/topics` | List all TCS aptitude topics |
| GET | `/api/company/<company>/aptitude/topics` | Company-specific aptitude topics |
| GET | `/api/company/<company>/aptitude/<topic>` | Company aptitude questions for a topic |
| GET | `/api/company/<company>/coding` | Company coding questions |
| GET | `/api/coding/languages` | All coding languages |
| GET | `/api/coding/languages/<lang>/topics` | Topics for a language |
| GET | `/api/interview/<category>` | AI-generated interview questions |
| POST | `/api/career/resume/score` | Upload and score a resume file |
| POST | `/api/analyze` | Performance analysis and recommendations |

---

## 🎨 Design System

- **Theme**: Deep navy dark background (`#071a2d` → `#0a2a44`)
- **Accent**: Teal (`#0ea5a4`, `#22d3ee`) and amber (`#f59e0b`)
- **Glassmorphism**: `rgba(255,255,255,0.07)` backgrounds with `0.5px` borders
- **Typography**: Sora (headings) + Segoe UI (body)
- **Animations**: Subtle `translateY` hover lifts, fade-slide-up entry animations

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Manjushri Nachimuthu**
- GitHub: [@Manjushrinachimuthu](https://github.com/Manjushrinachimuthu)

---

<p align="center">Built with ❤️ for placement preparation</p>
