# Healthcare Doctor-Patient Translation App

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/) [![Vercel](https://img.shields.io/badge/deploy-vercel-000000?logo=vercel)](https://vercel.com) [![Supabase](https://img.shields.io/badge/backend-supabase-2dd4bf?logo=supabase)](https://supabase.com)

A real-time translation bridge between doctors and patients, powered by Google Gemini AI. Built for **Nao Medical** take-home assignment.

## 🔗 Live Demo
**[https://healthcare-translator-two.vercel.app/](https://healthcare-translator-two.vercel.app/)**

---

## ✨ Features

- ✅ **Real-Time Translation** - Bidirectional translation between 15+ languages using Gemini AI
- ✅ **Role-Based Chat** - Clear distinction between Doctor (👨‍⚕️) and Patient (🤒) messages
- ✅ **Audio Recording** - Record and playback audio messages with browser MediaRecorder API
- ✅ **Conversation Logging** - All messages persist in Supabase PostgreSQL with timestamps
- ✅ **Search** - Real-time keyword search across conversation history
- ✅ **AI Summary** - Generate medical summaries extracting symptoms, diagnosis, medications, and follow-ups

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16, React, Tailwind CSS, shadcn/ui  
**Backend:** Next.js API Routes, Supabase (PostgreSQL + Storage)  
**AI:** Google Gemini 2.5 Flash  
**Deployment:** Vercel  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [Gemini API Key](https://aistudio.google.com/apikey)
- [Supabase Account](https://supabase.com)

### Installation

```bash
# Clone repository
git clone https://github.com/ayush080603/healthcare-translator.git
cd healthcare-translator

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📊 Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create tables
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  doctor_language VARCHAR(50) DEFAULT 'English',
  patient_language VARCHAR(50) DEFAULT 'Spanish'
);

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('doctor', 'patient')),
  original_text TEXT NOT NULL,
  translated_text TEXT,
  original_language VARCHAR(50),
  target_language VARCHAR(50),
  audio_url TEXT
);

CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX messages_created_at_idx ON messages(created_at DESC);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public access" ON messages FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access" ON conversations FOR ALL TO public USING (true) WITH CHECK (true);

-- Storage bucket policies (create 'audio-recordings' bucket first)
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'audio-recordings');
CREATE POLICY "Allow public downloads" ON storage.objects FOR SELECT TO public USING (bucket_id = 'audio-recordings');
```

---

## 📁 Project Structure

```
healthcare-translator/
├── app/
│   ├── api/
│   │   ├── translate/route.js    # Translation endpoint
│   │   ├── summary/route.js      # AI summary endpoint
│   │   └── messages/route.js     # Message CRUD
│   └── page.js
├── components/
│   ├── ChatInterface.jsx
│   ├── MessageBubble.jsx
│   └── AudioRecorder.jsx
├── lib/
│   ├── supabase.js
│   └── gemini.js
└── README.md
```

---

## 🤖 AI Integration

**Translation (`lib/gemini.js`):**
```javascript
export async function translateText(text, fromLang, toLang) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `Translate from ${fromLang} to ${toLang}. Return ONLY the translation: "${text}"`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
```

**Summarization:**
```javascript
export async function generateConversationSummary(messages) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  // Extracts: symptoms, diagnosis, medications, follow-ups
  // Returns structured medical summary
}
```

---

## 🚀 Deployment

```bash
# Deploy to Vercel
vercel

# Or connect GitHub repo to Vercel dashboard
# Add environment variables in Vercel settings
```

---

## ⚠️ Known Limitations

- Audio stored but not auto-transcribed (can add Web Speech API)
- Basic keyword search (could use fuzzy search)
- Manual language selection (could add auto-detection)
- No user authentication (can add Supabase Auth)
- Works best in Chrome/Edge for audio recording

---

## 🔮 Future Improvements

- Real-time speech-to-text transcription
- User authentication and conversation history
- Export conversations to PDF/DOCX
- Text-to-speech for translations
- Advanced semantic search
- EHR integration

---

## 🤖 AI Tools Used

- **Claude AI** - Architecture planning, code generation, debugging
- **GitHub Copilot** - Code completion
- **Google Gemini Documentation** - API integration
- **Supabase Docs** - Database setup

---

## 👨‍💻 Author

**Ayush Sinha**  
Full-Stack Developer | Next.js | AI Integration

- GitHub: [@ayush080603](https://github.com/ayush080603)
- LinkedIn: [https://www.linkedin.com/in/sinhaayush0806](#)
- Email: sinhaayush0806@gmail.com

---

## 📄 License

MIT License - Built with ❤️ for Nao Medical

---

**Quick Test:**
1. Visit live demo
2. Select Doctor role, English → Spanish
3. Type: "What brings you in today?"
4. Switch to Patient role, type response
5. Click Summary button
6. Test microphone recording
7. Try search feature