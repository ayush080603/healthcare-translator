import { generateConversationSummary } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { conversationId } = await request.json();
    
    // Fetch all messages for this conversation
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages found' },
        { status: 404 }
      );
    }

    const summary = await generateConversationSummary(messages);
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { error: 'Summary generation failed' },
      { status: 500 }
    );
  }
}