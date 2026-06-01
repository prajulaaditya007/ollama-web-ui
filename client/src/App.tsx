import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import PromptBar from "./components/PromptBar";
import Sidebar from "./components/Sidebar";
import LoginCard from "./components/LoginCard";
import { ChatProvider } from "./context/ChatContext";
import { useSessionState } from "./context/useChatContext";
import { UserContext, UserProfile } from "./context/UserContext";

const AppContent: React.FC<{
  model: string;
  setModel: (m: string) => void;
  handleSignOut: () => void;
}> = ({ model, setModel, handleSignOut }) => {
  const { sidebarOpen } = useSessionState();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        bgcolor: "background.default",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
      }}
    >
      {/* Left-hand ResponsiveDrawer Sidebar for chat history */}
      <Sidebar />

      {/* Main central chat panel */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          width: { sm: sidebarOpen ? `calc(100% - 230px)` : "100%" },
          overflow: "hidden",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Top Navigation / model switcher */}
        <Navbar
          model={model}
          setModel={setModel}
          onSignOut={handleSignOut}
        />

        {/* Scrollable messages area */}
        <ChatWindow />

        {/* Input box */}
        <PromptBar />
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  // Active Authenticated User state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("ollama_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Selected Model State (Persisted in localStorage)
  const [model, setModel] = useState<string>(() => {
    return localStorage.getItem("ollama_selected_model") || "tinyllama:1.1b";
  });

  // Sync local settings to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("ollama_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("ollama_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("ollama_selected_model", model);
  }, [model]);

  // Sign out active user profile
  const handleSignOut = () => {
    setCurrentUser(null);
  };

  const updateUsername = (newUsername: string) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return { ...prev, username: newUsername };
    });
  };

  // If no user is logged in, show the premium glassmorphic auth card
  if (!currentUser) {
    return <LoginCard onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <UserContext.Provider value={{ currentUser, updateUsername }}>
      <ChatProvider userId={currentUser.id} selectedModel={model}>
        <AppContent model={model} setModel={setModel} handleSignOut={handleSignOut} />
      </ChatProvider>
    </UserContext.Provider>
  );
};

export default App;
