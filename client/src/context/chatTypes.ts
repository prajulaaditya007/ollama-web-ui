// Shared TypeScript interfaces for chat data models.
// Kept in a separate file so they can be imported by both
// chatContexts.ts and ChatContext.tsx without circular deps.

export interface Message {
  id?: number;
  session_id?: number;
  role: "user" | "model";
  content: string;
  tokenCount?: number;
  created_at?: string;
}

export interface SendMessageOptions {
  images?: string[];
  docText?: string;
}

export interface ChatSession {
  id: number;
  user_id: number;
  is_pinned: boolean;
  title: string;
  model_id: string;
  provider: string;
  createdAt: number;
  updatedAt: number;
  messages?: Message[];
}

export interface APIChatSession {
  id: number;
  user_id: number;
  is_pinned?: boolean;
  title: string;
  model_id: string;
  provider: string;
  created_at: string;
  updated_at: string;
}

export interface APIMessage {
  id: number;
  session_id: number;
  role: string;
  content: string;
  token_count?: number;
  created_at: string;
}
