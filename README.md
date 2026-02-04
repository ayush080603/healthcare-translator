# Healthcare Doctor-Patient Translation Web Application

A real-time translation bridge between doctors and patients, powered by Google Gemini AI.

## 🔗 Live Demo
[https://healthcare-translator-two.vercel.app/](https://healthcare-translator-two.vercel.app/)

## 🚀 Features Implemented

### ✅ Core Features
- **Real-Time Translation**: Bidirectional translation between doctor and patient languages
- **Role-Based Chat**: Clear distinction between Doctor and Patient messages
- **Audio Recording**: Record and store audio messages with browser MediaRecorder API
- **Conversation Logging**: All messages persist in Supabase database with timestamps
- **Search Functionality**: Search through conversation history by keywords
- **AI-Powered Summary**: Generate medical summaries with key information extraction

### 🎨 UI/UX Features
- Mobile-responsive design
- Clean, intuitive chat interface
- Language selection for both roles
- Visual role indicators (Doctor 👨‍⚕️ / Patient 🤒)
- Audio playback in conversation thread

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React**
- **Tailwind CSS**
- **shadcn/ui** components

### Backend
- **Next.js API Routes**
- **Supabase** (PostgreSQL database + Storage)

### AI/ML
- **Google Gemini 2.5 Flash** for translation and summarization

### Deployment
- **Vercel** (hosting and deployment)

## 🤖 AI Tools & Resources Used

- **GitHub Copilot** - Code completion and boilerplate generation
- **ChatGPT/Claude** - Architecture planning and debugging assistance
- **Google Gemini Documentation** - API integration guidance
- **Supabase Documentation** - Database setup and queries
- **shadcn/ui** - Pre-built accessible UI components

## 📁 Project Structure
```
healthcare-translator/
├── app/
│   ├── api/
│   │   ├── translate/route.js
│   │   ├── summary/route.js
│   │   └── messages/route.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── ChatInterface.jsx
│   ├── MessageBubble.jsx
│   └── AudioRecorder.jsx
├── lib/
│   ├── supabase.js
│   └── gemini.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Gemini API Key
- Supabase account

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ayush080603/healthcare-translator.git
cd healthcare-translator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## ⚠️ Known Limitations

- **Audio Transcription**: Currently stores audio files but doesn't transcribe them automatically (could be enhanced with Web Speech API or Gemini's audio capabilities)
- **Search**: Basic keyword matching (could be enhanced with fuzzy search or semantic search)
- **Language Detection**: Manual language selection required (could add auto-detection)
- **Offline Support**: Requires internet connection for AI features
- **Browser Compatibility**: Audio recording works best in Chrome/Edge

## 🔮 Future Improvements

Given more time, I would add:
- **Real-time Transcription**: Automatic speech-to-text for audio messages
- **Multi-language Support**: Expand beyond current language list
- **Conversation Export**: Download conversations as PDF/DOCX
- **Voice Synthesis**: Text-to-speech for translated messages
- **Advanced Search**: Semantic search with embeddings
- **User Authentication**: Secure doctor/patient accounts
- **Conversation Analytics**: Track common symptoms, medications, etc.

## 📊 Database Schema

### Conversations Table
- `id` (UUID, Primary Key)
- `created_at` (Timestamp)
- `doctor_language` (VARCHAR)
- `patient_language` (VARCHAR)

### Messages Table
- `id` (UUID, Primary Key)
- `conversation_id` (UUID, Foreign Key)
- `created_at` (Timestamp)
- `sender_role` (VARCHAR: 'doctor' or 'patient')
- `original_text` (TEXT)
- `translated_text` (TEXT)
- `original_language` (VARCHAR)
- `target_language` (VARCHAR)
- `audio_url` (TEXT, nullable)

## 🙏 Acknowledgments

- Google Gemini AI for translation and summarization
- Supabase for database and storage
- shadcn/ui for beautiful, accessible components
- Vercel for seamless deployment

## 📝 License

MIT

---

**Developed as a take-home assignment for Nao Medical**