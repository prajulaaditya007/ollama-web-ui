// Separated from ChatContext.tsx so Vite Fast Refresh works correctly.
// Rule: a file must export ONLY React components OR only non-component values.
// Context objects (createContext) are not components, so they live here.

import React, { createContext } from "react";
import { ChatSession, Message, SendMessageOptions } from "./chatTypes";

export interface SessionState {
  sessions: ChatSession[];
  currentSessionId: number | null;
  setCurrentSessionId: (id: number | null) => void;
  sidebarOpen: boolean;
  dbError: string | null;
}

export interface MessageState {
  messages: Message[];
  loading: boolean;
}

export interface ChatActions {
  createNewSession: () => Promise<void>;
  deleteSession: (id: number, event?: React.MouseEvent) => Promise<void>;
  sendMessage: (promptText: string, options?: SendMessageOptions) => Promise<void>;
  stopGeneration: () => void;
  loadSessions: () => Promise<ChatSession[]>;
  toggleSidebar: () => void;
}

export const SessionStateContext = createContext<SessionState | undefined>(
  undefined,
);
export const MessageStateContext = createContext<MessageState | undefined>(
  undefined,
);
export const ChatActionsContext = createContext<ChatActions | undefined>(
  undefined,
);
