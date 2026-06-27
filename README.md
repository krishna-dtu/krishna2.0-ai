# Krishna-2.0 AI Chat Application

A sleek, professional, and minimalist AI chat interface powered by Google's Gemini API. Built with Next.js and FastAPI.

## ✨ Features

- 🎨 **Modern UI Design** - Clean, minimalist interface inspired by ChatGPT and Gemini
- 💬 **Real-time Chat** - Smooth animations and responsive messaging
- 🤖 **AI-Powered** - Integrated with Google Gemini API
- 📱 **Responsive** - Works seamlessly on desktop and mobile
- 🌙 **Dark Mode Ready** - Beautiful dark theme support
- ⚡ **Fast & Efficient** - Built with performance in mind

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up your environment variables in `backend/.env`:
```env
ENV=development
HOST=127.0.0.1
PORT=8000
DEBUG=1
GEMINI_API_KEY=your_api_key_here
```

4. Run the backend server:
```bash
python -m backend.run_server
```

The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🎯 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Start chatting with Krishna-2.0, your UPSC study assistant
3. Ask questions about UPSC preparation, concepts, or study strategies
4. Enjoy the smooth, professional chat experience!

## 🛠️ Technology Stack

### Frontend
- **Next.js 13** - React framework for production
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Dark mode** - Built-in theme support

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Google Gemini API** - AI language model
- **HTTPX** - Async HTTP client
- **Python-dotenv** - Environment configuration

## 📁 Project Structure

```
.
├── backend/
│   ├── app.py                    # FastAPI application
│   ├── krishna_api.py            # API routes and Gemini integration
│   ├── run_server.py             # Server startup script
│   ├── requirements.txt          # Python dependencies
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── components/
│   │   └── Chat.jsx              # Main chat component
│   ├── pages/
│   │   ├── index.js              # Home page
│   │   └── _app.js               # Next.js app wrapper
│   ├── styles/
│   │   └── globals.css           # Global styles
│   ├── package.json              # Node dependencies
│   └── tailwind.config.js        # Tailwind configuration
│
└── README.md                     # This file
```

## 🎨 UI Features

- **Clean Layout** - Full-screen chat interface with sticky header and input
- **Smart Scrolling** - Auto-scrolls to latest messages
- **Message Bubbles** - Distinct styling for user and AI messages
- **Typing Indicator** - Animated dots show when AI is thinking
- **Status Indicator** - Real-time connection status
- **Suggested Prompts** - Quick-start suggestions for new users
- **Error Handling** - Graceful error messages and recovery
- **Keyboard Shortcuts** - Press Enter to send (Shift+Enter for new line)

## 🔧 API Endpoints

### Backend Endpoints

- `GET /` - Health check endpoint
- `GET /krishna2/system_prompt` - Get the system prompt
- `POST /krishna2/chat` - Send a chat message

### Chat Request Format

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your question here"
    }
  ],
  "model": "gemini-flash-latest",
  "max_tokens": 2048
}
```

## 🔐 Security Notes

- API keys are stored in `.env` files (not committed to Git)
- CORS is configured for development (localhost)
- Production deployment requires proper environment configuration

## 📝 Customization

### Change AI Personality

Edit `backend/krishna_system_prompt.txt` to customize the AI's behavior and personality.

### Modify UI Colors

Update the Tailwind classes in `frontend/components/Chat.jsx`:
- Change `from-purple-500 to-indigo-600` for different gradient colors
- Modify border colors, backgrounds, etc.

### Adjust API Settings

Edit `backend/krishna_api.py` to modify:
- Temperature, top_k, top_p parameters
- Max tokens
- Model selection

## 🐛 Troubleshooting

**Backend won't start:**
- Check that Python 3.8+ is installed
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Ensure port 8000 is not in use

**Frontend won't start:**
- Check that Node.js 16+ is installed
- Delete `node_modules` and run `npm install` again
- Ensure port 3000 is not in use

**Chat not working:**
- Verify backend is running on port 8000
- Check browser console for errors
- Verify Gemini API key is valid
- Check browser network tab for failed requests

## 📄 License

This project is for educational purposes.

## 👨‍💻 Development

Both servers support hot-reload for rapid development:
- Backend: Auto-reloads on Python file changes
- Frontend: Next.js hot-reloads on React component changes

## 🎉 Contributing

Feel free to submit issues and enhancement requests!
