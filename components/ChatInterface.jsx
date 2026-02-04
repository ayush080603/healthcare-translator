'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, FileText, Search } from 'lucide-react';
import MessageBubble from './MessageBubble';
import AudioRecorder from './AudioRecorder';
import { supabase } from '@/lib/supabase';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 
  'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Hindi',
  'Arabic', 'Russian', 'Dutch', 'Polish', 'Turkish'
];

export default function ChatInterface() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentRole, setCurrentRole] = useState('doctor');
  const [messageText, setMessageText] = useState('');
  const [doctorLang, setDoctorLang] = useState('English');
  const [patientLang, setPatientLang] = useState('Spanish');
  const [isSending, setIsSending] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  // Create new conversation on mount
  useEffect(() => {
    createNewConversation();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const createNewConversation = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .insert([{ doctor_language: doctorLang, patient_language: patientLang }])
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return;
    }

    setConversationId(data.id);
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !conversationId) return;

    setIsSending(true);

    try {
      const sourceLang = currentRole === 'doctor' ? doctorLang : patientLang;
      const targetLang = currentRole === 'doctor' ? patientLang : doctorLang;

      // Translate message
      const translateResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: messageText,
          sourceLang,
          targetLang
        })
      });

      const { translation } = await translateResponse.json();

      // Save message to database
      const messageData = {
        conversation_id: conversationId,
        sender_role: currentRole,
        original_text: messageText,
        translated_text: translation,
        original_language: sourceLang,
        target_language: targetLang
      };

      const saveResponse = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      const savedMessage = await saveResponse.json();
      
      // Add to local state
      setMessages(prev => [...prev, savedMessage]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleAudioRecorded = async (audioBlob) => {
    try {
      // Upload audio to Supabase Storage
      const fileName = `${conversationId}_${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-recordings')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-recordings')
        .getPublicUrl(fileName);

      // For now, just save the audio URL without transcription
      // You can add Web Speech API transcription here if needed
      const messageData = {
        conversation_id: conversationId,
        sender_role: currentRole,
        original_text: '[Audio Message]',
        translated_text: '[Audio - Translation pending]',
        original_language: currentRole === 'doctor' ? doctorLang : patientLang,
        target_language: currentRole === 'doctor' ? patientLang : doctorLang,
        audio_url: publicUrl
      };

      const saveResponse = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      const savedMessage = await saveResponse.json();
      setMessages(prev => [...prev, savedMessage]);
    } catch (error) {
      console.error('Error saving audio:', error);
      alert('Failed to save audio recording');
    }
  };

  const generateSummary = async () => {
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      });

      const { summary: generatedSummary } = await response.json();
      setSummary(generatedSummary);
      setShowSummary(true);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary');
    }
  };

  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.original_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.translated_text && msg.translated_text.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : messages;

  return (
    <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
      {/* Header */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <h1 className="text-2xl font-bold">Healthcare Translator 🏥</h1>
          
          <div className="flex gap-2 items-center flex-wrap">
            <Select value={currentRole} onValueChange={setCurrentRole}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">👨‍⚕️ Doctor</SelectItem>
                <SelectItem value="patient">🤒 Patient</SelectItem>
              </SelectContent>
            </Select>

            <Select value={doctorLang} onValueChange={setDoctorLang}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Doctor Lang" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={patientLang} onValueChange={setPatientLang}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Patient Lang" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={generateSummary} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Summary
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {filteredMessages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No messages yet. Start the conversation!
            </div>
          ) : (
            filteredMessages.map((message) => (
              <MessageBubble key={message.id} message={message} role={currentRole} />
            ))
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t flex gap-2">
          <AudioRecorder onAudioRecorded={handleAudioRecorded} />
          
          <Input
            placeholder={`Type message as ${currentRole}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isSending}
          />
          
          <Button onClick={sendMessage} disabled={isSending || !messageText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
            <h2 className="text-xl font-bold mb-4">Conversation Summary</h2>
            <div className="prose prose-sm whitespace-pre-wrap">
              {summary}
            </div>
            <Button onClick={() => setShowSummary(false)} className="mt-4">
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}