import React, { createContext, useState, useEffect, useRef, useCallback, useContext } from "react";

export interface Message {
  id?: number;
  session_id?: number;
  role: "user" | "model";
  content: string;
  tokenCount?: number;
  created_at?: string;
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

interface SessionState {
  sessions: ChatSession[];
  currentSessionId: number | null;
  setCurrentSessionId: (id: number | null) => void;
  sidebarOpen: boolean;
}

interface MessageState {
  messages: Message[];
  loading: boolean;
}

interface ChatActions {
  createNewSession: () => Promise<void>;
  deleteSession: (id: number, event?: React.MouseEvent) => Promise<void>;
  sendMessage: (promptText: string) => Promise<void>;
  stopGeneration: () => void;
  loadSessions: () => Promise<ChatSession[]>;
  toggleSidebar: () => void;
}

const SessionStateContext = createContext<SessionState | undefined>(undefined);
const MessageStateContext = createContext<MessageState | undefined>(undefined);
const ChatActionsContext = createContext<ChatActions | undefined>(undefined);

const API_BASE_URL = "http://localhost:8080/api";

export const ChatProvider: React.FC<{
  userId: number | null;
  selectedModel: string;
  children: React.ReactNode;
}> = ({ userId, selectedModel, children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("ollama_sidebar_open");
    return saved ? JSON.parse(saved) : true;
  });

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    localStorage.setItem("ollama_sidebar_open", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // 1. Fetch sessions from remote PostgreSQL database for the logged-in user
  const loadSessions = useCallback(async () => {
    if (userId === null) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/sessions?user_id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const data = await response.json();

      const mappedSessions: ChatSession[] = data.map((s: APIChatSession) => ({
        id: s.id,
        user_id: s.user_id,
        is_pinned: s.is_pinned || false,
        title: s.title,
        model_id: s.model_id,
        provider: s.provider,
        createdAt: new Date(s.created_at).getTime(),
        updatedAt: new Date(s.updated_at).getTime(),
        messages: [],
      }));
      setSessions(mappedSessions);
      return mappedSessions;
    } catch (error) {
      console.error("Failed to load sessions:", error);
      return [];
    }
  }, [userId]);

  // Initial load and sync on user changes
  useEffect(() => {
    if (userId === null) {
      setSessions([]);
      setCurrentSessionId(null);
      return;
    }

    loadSessions().then((loadedSessions) => {
      const savedIdStr = localStorage.getItem("ollama_current_session_id");
      if (savedIdStr) {
        const savedId = parseInt(savedIdStr, 10);
        if (loadedSessions.some((s) => s.id === savedId)) {
          setCurrentSessionId(savedId);
          return;
        }
      }
      if (loadedSessions.length > 0) {
        setCurrentSessionId(loadedSessions[0].id);
      }
    });
  }, [loadSessions, userId]);

  // Sync currentSessionId selection to localStorage
  useEffect(() => {
    if (currentSessionId !== null) {
      localStorage.setItem("ollama_current_session_id", currentSessionId.toString());
    } else {
      localStorage.removeItem("ollama_current_session_id");
    }
  }, [currentSessionId]);

  // 2. Fetch messages for the active session
  useEffect(() => {
    if (currentSessionId === null) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const loadMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sessions/${currentSessionId}/messages`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();

        if (isMounted) {
          const mappedMessages: Message[] = (data || []).map((m: APIMessage) => ({
            id: m.id,
            session_id: m.session_id,
            role: m.role as "user" | "model",
            content: m.content,
            tokenCount: m.token_count,
            created_at: m.created_at,
          }));
          setMessages(mappedMessages);
        }
      } catch (error) {
        console.error(`Failed to load messages for session ${currentSessionId}:`, error);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [currentSessionId]);

  // 3. Create a new chat session in the DB instantly
  const createNewSession = useCallback(async () => {
    if (userId === null) return;
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title: "New Chat",
          model_id: selectedModel,
          provider: "ollama",
        }),
      });
      if (!response.ok) throw new Error("Failed to create session");
      const newSession = await response.json();

      const mappedSession: ChatSession = {
        id: newSession.id,
        user_id: newSession.user_id,
        is_pinned: newSession.is_pinned || false,
        title: newSession.title,
        model_id: newSession.model_id,
        provider: newSession.provider,
        createdAt: new Date(newSession.created_at).getTime(),
        updatedAt: new Date(newSession.updated_at).getTime(),
        messages: [],
      };

      setSessions((prev) => [mappedSession, ...prev]);
      setCurrentSessionId(mappedSession.id);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create new session:", error);
    }
  }, [selectedModel, userId]);

  // 4. Delete session from DB safely
  const deleteSession = useCallback(async (id: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (userId === null) return;

    if (id === currentSessionId && loading) {
      stopGeneration();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}?user_id=${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete session");

      setSessions((prev) => prev.filter((s) => s.id !== id));

      if (currentSessionId === id) {
        const remaining = sessions.filter((s) => s.id !== id);
        if (remaining.length > 0) {
          setCurrentSessionId(remaining[0].id);
        } else {
          setCurrentSessionId(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  }, [currentSessionId, loading, sessions, userId]);

  // 5. Abort current SSE/Stream generation
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  // 6. Send message leveraging backend auto-session creation
  const sendMessage = useCallback(async (promptText: string) => {
    if (!promptText.trim() || loading || userId === null) return;

    setLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Immediately add message visual turns to UI
    const userMsg: Message = { role: "user", content: promptText };
    const placeholderMsg: Message = { role: "model", content: "" };
    setMessages((prev) => [...prev, userMsg, placeholderMsg]);

    let activeId = currentSessionId || 0;

    try {
      // Stream from Go API proxy
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          session_id: activeId,
          prompt: promptText,
          model_id: selectedModel,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Proxy communication failed");
      }

      if (!response.body) throw new Error("Stream response body is empty");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamDone = false;
      let buffer = "";
      let fullResponseBuffer = "";

      while (!streamDone) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
          buffer += decoder.decode(value);
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const data = JSON.parse(line);

              // CASE A: Auto-created session metadata yielding from Go backend
              if (data.session_id && !data.message) {
                activeId = data.session_id;
                setCurrentSessionId(activeId);

                const newSessionObj: ChatSession = {
                  id: activeId,
                  user_id: userId,
                  is_pinned: false,
                  title: data.title || "New Chat",
                  model_id: data.model_id || selectedModel,
                  provider: "ollama",
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                  messages: [userMsg, placeholderMsg],
                };
                setSessions((prev) => [newSessionObj, ...prev]);
                continue;
              }

              // CASE B: Standard Ollama chat stream token chunk
              if (data.message && data.message.content) {
                fullResponseBuffer += data.message.content;

                setMessages((prev) => {
                  const copy = [...prev];
                  let idx = -1;
                  for (let i = copy.length - 1; i >= 0; i--) {
                    if (copy[i].role === "model") {
                      idx = i;
                      break;
                    }
                  }
                  if (idx !== -1) {
                    copy[idx] = {
                      ...copy[idx],
                      content: fullResponseBuffer,
                    };
                  }
                  return copy;
                });
              }

              // CASE C: Stream finalized
              if (data.done === true) {
                const tokenCount = data.eval_count;
                const promptTokenCount = data.prompt_eval_count;

                setMessages((prev) => {
                  const copy = [...prev];
                  let idx = -1;
                  for (let i = copy.length - 1; i >= 0; i--) {
                    if (copy[i].role === "model") {
                      idx = i;
                      break;
                    }
                  }
                  if (idx !== -1) {
                    copy[idx] = {
                      ...copy[idx],
                      content: fullResponseBuffer,
                      tokenCount,
                    };
                    if (idx > 0 && copy[idx - 1].role === "user") {
                      copy[idx - 1] = {
                        ...copy[idx - 1],
                        tokenCount: promptTokenCount,
                      };
                    }
                  }
                  return copy;
                });
              }
            } catch (jsonErr) {
              // Skip parsing errors for partial or malformed lines
              console.log("json error: ", jsonErr);
            }
          }
        }
        streamDone = readerDone;
      }

      // Finalize and reload DB sessions to capture timestamps and titles
      await loadSessions();
    } catch (err) {
      const error = err as Error;
      if (error.name === "AbortError") {
        console.log("Stream generation manually stopped");
      } else {
        console.error("Stream reader error:", error);

        setMessages((prev) => {
          const copy = [...prev];
          let idx = -1;
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === "model") {
              idx = i;
              break;
            }
          }
          if (idx !== -1) {
            copy[idx] = {
              ...copy[idx],
              content:
                copy[idx].content +
                `\n\n*(Error: ${error.message || "Failed to communicate with Go backend. Verify the backend and local Ollama are active."})*`,
            };
          }
          return copy;
        });
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [currentSessionId, selectedModel, loading, loadSessions, userId]);

  return (
    <SessionStateContext.Provider value={{ sessions, currentSessionId, setCurrentSessionId, sidebarOpen }}>
      <MessageStateContext.Provider value={{ messages, loading }}>
        <ChatActionsContext.Provider value={{ createNewSession, deleteSession, sendMessage, stopGeneration, loadSessions, toggleSidebar }}>
          {children}
        </ChatActionsContext.Provider>
      </MessageStateContext.Provider>
    </SessionStateContext.Provider>
  );
};

export const useSessionState = () => {
  const context = useContext(SessionStateContext);
  if (!context) throw new Error("useSessionState must be used within a ChatProvider");
  return context;
};

export const useMessageState = () => {
  const context = useContext(MessageStateContext);
  if (!context) throw new Error("useMessageState must be used within a ChatProvider");
  return context;
};

export const useChatActions = () => {
  const context = useContext(ChatActionsContext);
  if (!context) throw new Error("useChatActions must be used within a ChatProvider");
  return context;
};
