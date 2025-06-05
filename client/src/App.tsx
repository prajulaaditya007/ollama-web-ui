import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import ChatArea from "./components/ChatArea";
import PromptBar from "./components/PromptBar";

// Centralize messages/model here (Redux soon, keep simple now)
export interface Message {
  role: "user" | "model";
  content: string;
  model?: string;
}

const darkTheme = createTheme({ palette: { mode: "dark" } });

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState("tinyllama:1.1b"); // default

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar model={model} setModel={setModel} />
        <ChatArea messages={messages} />
        <PromptBar
          model={model}
          setMessages={setMessages}
          messages={messages}
        />
      </Box>
    </ThemeProvider>
  );
};

export default App;
