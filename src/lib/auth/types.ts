export interface UserSession {
  id: string;
  email: string;
  discord_id?: string;
  avatar_url?: string;
  username?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  signIn: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  handleAddToDiscord: () => Promise<void>;
} 