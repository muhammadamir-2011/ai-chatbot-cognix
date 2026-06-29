# AI Yordamchi — Python + Flask + Gemini API

Bu loyiha VS Code'da ishga tushiriladigan, Gemini API orqali ishlaydigan chatbot.
API kalit endi **server tomonida** (Python kodida) saqlanadi, brauzerga umuman
yuborilmaydi — bu xavfsizroq yondashuv.

## Loyiha tarkibi

```
vscode-chatbot/
├── app.py              ← Flask server (Gemini bilan gaplashadi)
├── templates/
│   └── index.html      ← Chat interfeysi
├── static/
│   └── style.css       ← Dizayn
├── requirements.txt    ← Kerakli kutubxonalar
├── .env.example        ← API kalit shabloni
└── .gitignore
```

## 1. VS Code'da ochish

Loyiha papkasini VS Code'da oching: **File → Open Folder** → `vscode-chatbot` papkasini tanlang.

## 2. Python o'rnatilganini tekshirish

Terminalda (VS Code ichidagi terminal: **Terminal → New Terminal**):

```bash
python --version
```

Agar Python 3.9+ chiqsa — yaxshi. Agar topilmasa, [python.org](https://python.org)'dan o'rnating.

## 3. Virtual muhit yaratish (tavsiya etiladi)

```bash
python -m venv venv
```

Faollashtirish:
- **Windows:** `venv\Scripts\activate`
- **Mac/Linux:** `source venv/bin/activate`

## 4. Kutubxonalarni o'rnatish

```bash
pip install -r requirements.txt
```

## 5. API kalitni sozlash

1. [aistudio.google.com/apikey](https://aistudio.google.com/apikey) dan bepul Gemini API kalitini oling
2. `.env.example` faylini nusxalab `.env` deb nomlang:
   ```bash
   cp .env.example .env
   ```
   (Windows'da: `copy .env.example .env`)
3. `.env` faylini oching va `AIzaSy_bu_yerga...` o'rniga haqiqiy kalitingizni qo'ying:
   ```
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
   ```

## 6. Serverni ishga tushirish

```bash
python app.py
```

Terminalda shunga o'xshash xabar chiqadi:
```
* Running on http://127.0.0.1:5000
```

## 7. Brauzerda ochish

`http://127.0.0.1:5000` manzilini brauzerda oching — chatbot tayyor!

## Botning xarakterini o'zgartirish

`app.py` faylida `SYSTEM_PROMPT` o'zgaruvchisini topib, matnni o'zingizga moslab tahrirlang.

## Muammolar

| Muammo | Yechim |
|---|---|
| `ModuleNotFoundError: No module named 'flask'` | `pip install -r requirements.txt` ni qaytadan ishlating |
| `GEMINI_API_KEY topilmadi` xatosi | `.env` faylini yaratganingizni va kalitni to'g'ri qo'yganingizni tekshiring |
| Sahifa ochilmayapti | Terminal'da server hali ishlab turganini tekshiring (`Ctrl+C` bosmagansiz) |
| 429 xatolik (rate limit) | Bepul tarif chegarasiga yetdingiz, bir oz kutib qaytadan urinib ko'ring |

## Keyingi qadamlar (ixtiyoriy)

- Suhbat tarixini fayl yoki bazaga saqlash
- Ko'p foydalanuvchi uchun session boshqaruvi qo'shish
- Internetga chiqarish uchun (masalan, Render, Railway) deploy qilish
