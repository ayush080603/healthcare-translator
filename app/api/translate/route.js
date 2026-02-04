import { translateText } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, sourceLang, targetLang } = await request.json();
    
    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const translation = await translateText(text, sourceLang, targetLang);
    
    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}