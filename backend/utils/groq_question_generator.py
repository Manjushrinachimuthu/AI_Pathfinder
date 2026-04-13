import json
import os
import re
from typing import Any, Dict, List, Optional

from groq import Groq


DEFAULT_MODEL = "llama-3.1-8b-instant"
ALLOWED_DIFFICULTIES = {"easy", "medium", "hard"}
ALLOWED_TYPES = {"coding", "technical", "hr"}


def _resolve_api_key(explicit_api_key: Optional[str] = None) -> str:
    api_key = (
        explicit_api_key
        or os.getenv("GROQ_API_KEY")
    )
    if not api_key:
        raise ValueError("Missing API key. Set GROQ_API_KEY in your backend .env file.")
    return api_key


def _extract_json_array_from_text(text: str) -> Optional[List[Any]]:
    payload = (text or "").strip()
    if not payload:
        return None

    if payload.startswith("```"):
        payload = re.sub(r"^```[a-zA-Z]*\s*", "", payload)
        payload = re.sub(r"\s*```$", "", payload).strip()

    try:
        parsed = json.loads(payload)
        if isinstance(parsed, list):
            return parsed
    except Exception:
        pass

    start = payload.find("[")
    end = payload.rfind("]")
    if start != -1 and end != -1 and end > start:
        try:
            parsed = json.loads(payload[start:end + 1])
            if isinstance(parsed, list):
                return parsed
        except Exception:
            return None
    return None


def _sanitize_question_text(value: Any) -> str:
    return str(value or "").strip()


def _build_prompt(topic: str, count: int, difficulty: str, question_type: str) -> List[Dict[str, str]]:
    q_type = question_type if question_type in ALLOWED_TYPES else "coding"
    difficulty_value = difficulty if difficulty in ALLOWED_DIFFICULTIES else "medium"
    topic_value = topic.strip() or "Software Engineering"

    system_prompt = (
        "You are an interview preparation assistant. "
        "Return only valid JSON. No markdown. "
        "Output must be a JSON array of objects. "
        "Each object must contain a single key: question."
    )

    user_prompt = (
        f"Generate exactly {count} {q_type} interview questions for topic '{topic_value}'. "
        f"Difficulty: {difficulty_value}. "
        "Questions should be concise, realistic, and suitable for freshers. "
        "Return only a JSON array."
    )

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


def get_questions(
    topic: str,
    count: int = 10,
    difficulty: str = "medium",
    question_type: str = "coding",
    model: Optional[str] = None,
    api_key: Optional[str] = None,
) -> List[Dict[str, Any]]:
    safe_count = max(1, min(50, int(count or 10)))
    selected_model = (model or os.getenv("GROQ_MODEL") or DEFAULT_MODEL).strip()
    resolved_api_key = _resolve_api_key(api_key)

    client = Groq(api_key=resolved_api_key)
    completion = client.chat.completions.create(
        model=selected_model,
        messages=_build_prompt(topic, safe_count, difficulty.lower(), question_type.lower()),
        temperature=0.6,
    )

    content = (
        ((completion.choices or [None])[0] or {})
        .message.content
        if completion and completion.choices
        else ""
    )
    raw = _extract_json_array_from_text(content or "")
    if not raw:
        raise ValueError("Groq response could not be parsed as a JSON array.")

    questions: List[Dict[str, Any]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        question_text = _sanitize_question_text(item.get("question"))
        if not question_text:
            continue
        questions.append(
            {
                "id": len(questions) + 1,
                "question": question_text,
                "answer": "",
            }
        )
        if len(questions) >= safe_count:
            break

    if not questions:
        raise ValueError("Groq returned no usable questions.")

    return questions
