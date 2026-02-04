import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function MessageBubble({ message, role }) {
  const isDoctor = message.sender_role === 'doctor';
  
  return (
    <div className={`flex ${isDoctor ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[70%] ${isDoctor ? 'items-start' : 'items-end'} flex flex-col`}>
        <Badge 
          variant={isDoctor ? 'default' : 'secondary'} 
          className="mb-1"
        >
          {isDoctor ? '👨‍⚕️ Doctor' : '🤒 Patient'}
        </Badge>
        
        <Card className={`p-3 ${isDoctor ? 'bg-blue-50' : 'bg-green-50'}`}>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {message.original_text}
          </p>
          
          {message.translated_text && (
            <p className="text-xs text-gray-600 italic border-t pt-2 mt-2">
              Translation: {message.translated_text}
            </p>
          )}
          
          {message.audio_url && (
            <audio 
              controls 
              className="mt-2 w-full h-8"
              src={message.audio_url}
            />
          )}
          
          <p className="text-xs text-gray-400 mt-2">
            {new Date(message.created_at).toLocaleTimeString()}
          </p>
        </Card>
      </div>
    </div>
  );
}