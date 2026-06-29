"""
Cognix AI — Flask backend
Bu server Gemini API bilan gaplashadi va API kalitni xavfsiz saqlaydi
(brauzerga hech qachon yubormaydi).
"""

import os
import requests
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# .env faylidan API kalitni o'qish
load_dotenv()

app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

# Botning xarakteri (xohlasangiz o'zgartiring)
SYSTEM_PROMPT = (
    "Sening isming Cognix AI. Seni Muhammad Amir Sobirov yaratgan va sen "
    "uning shaxsiy loyihasisan. Sen Google yoki boshqa hech qanday kompaniyaga "
    "tegishli emassan — agar kim yaratgani so'ralsa, doim Cognix AI ekaningni "
    "va Muhammad Amir Sobirov yaratganini ayt, hech qachon o'zingni Google "
    "yoki boshqa AI deb atama.\n\n"
    "Xarakteringiz: do'stona, hazil-mutoyibali va engil. Suhbatni rasmiy emas, "
    "samimiy yo'ldosh ohangida olib bor. Javoblaringda o'rinli joyda emoji "
    "ishlatishing mumkin (lekin har bir gapda emas — tabiiy his bo'lsin).\n\n"
    "Har doim o'zbek tilida javob ber, agar foydalanuvchi boshqa tilda yozmasa. "
    "Javoblarni qisqa va aniq tut, ortiqcha cho'zib yubormay."
)


@app.route("/")
def index():
    """Bosh sahifani ko'rsatadi."""
    return render_template("index.html")


@app.route("/robots.txt")
def robots():
    """Qidiruv tizimlari uchun robots.txt'ni ildiz manzilda taqdim etadi."""
    return app.send_static_file("robots.txt")


@app.route("/api/chat", methods=["POST"])
def chat():
    """Foydalanuvchi xabarini qabul qiladi, Gemini API'ga yuboradi, javobni qaytaradi."""
    if not GEMINI_API_KEY:
        return jsonify({
            "error": "GEMINI_API_KEY topilmadi. .env faylga API kalitingizni qo'shing."
        }), 500

    data = request.get_json()
    if not data or "history" not in data:
        return jsonify({"error": "Noto'g'ri so'rov formati."}), 400

    history = data["history"]  # [{"role": "user"/"model", "parts": [{"text": "..."}]}]

    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": history,
    }

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
    }

    try:
        response = requests.post(GEMINI_URL, json=payload, headers=headers, timeout=30)
        result = response.json()
    except requests.RequestException as e:
        return jsonify({"error": f"Tarmoq xatoligi: {str(e)}"}), 502

    if "error" in result:
        message = result["error"].get("message", "Noma'lum xatolik")
        return jsonify({"error": message}), response.status_code

    try:
        candidates = result.get("candidates", [])
        if not candidates:
            return jsonify({"error": "Gemini hech qanday javob qaytarmadi."}), 502

        parts = candidates[0]["content"]["parts"]
        reply_text = "\n".join(p.get("text", "") for p in parts).strip()
        return jsonify({"reply": reply_text})
    except (KeyError, IndexError) as e:
        return jsonify({"error": f"Javobni o'qishda xatolik: {str(e)}"}), 502


if __name__ == "__main__":
    app.run(debug=True, port=5000)
