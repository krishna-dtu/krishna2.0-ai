Frontend (Next.js) setup

Install dependencies:

```bash
cd frontend
npm install
```

Run dev server:

```bash
npm run dev
```

Notes:
- The frontend calls the backend at `http://127.0.0.1:8000/krishna2/chat` by default. Adjust `backend/app.py` `FRONTEND_ORIGINS` if you serve frontend elsewhere.
- Styling uses Tailwind and animations use Framer Motion.
