// Separated from ChatContext.tsx so Vite Fast Refresh works correctly.
// Fast Refresh requires a file to export ONLY components OR ONLY non-components (hooks/constants).
// ChatProvider (component) lives in ChatContext.tsx; hooks live here.

import { useContext } from "react";
import {
  SessionStateContext,
  MessageStateContext,
  ChatActionsContext,
} from "./chatContexts";

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
