'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';

export function AddBotButton({ guildId }: { guildId?: string }) {
  const { handleAddBot } = useAuth();

  return (
    <Button 
      onClick={() => handleAddBot(guildId)}
      className="bg-discord hover:bg-discord/90"
    >
      Add Bot to Server
    </Button>
  );
} 