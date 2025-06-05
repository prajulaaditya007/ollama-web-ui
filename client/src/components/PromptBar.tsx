import React, { useState, useRef } from "react";
import { Box, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import { Message } from "../App";

import { streamModel } from "../api"; // as above

interface Props {
  model: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messages: Message[];
}

const PromptBar: React.FC<Props> = ({ model, setMessages }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);
    setInput("");

    // Add model message placeholder
    setMessages((prev) => [
      ...prev,
      { role: "model", content: "", model: model },
    ]);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const reader = await streamModel(
        model,
        input,
        false,
        "",
        controller.signal
      );
      let buffer = "";
      let done = false;
      while (!done) {
        const { value, done: isDone } = await reader.read();
        if (value) {
          const chunk = new TextDecoder().decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (typeof data.response === "string") {
                buffer += data.response;
                setMessages((prev) => {
                  // Update last model message
                  const updated = [...prev];
                  for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].role === "model") {
                      updated[i] = {
                        ...updated[i],
                        content: buffer,
                        model: model,
                      };
                      break;
                    }
                  }
                  return updated;
                });
              }
            } catch (err) {
                console.log(err)
            }
          }
        }
        done = isDone;
      }
    } catch (err) {
      // If aborted, just exit
      console.log('just in case',err)
    }
    setLoading(false);
    controllerRef.current = null;
  };

  // Stop generation
  const handleStop = () => {
    controllerRef.current?.abort();
    setLoading(false);
  };

  return (
    <Box
      sx={{
        px: { xs: 1, md: 10 },
        py: 2,
        bgcolor: "background.default",
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: "1px solid #22272e",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message…"
        variant="outlined"
        disabled={loading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        sx={{ mr: 2, bgcolor: "#23272f", borderRadius: 2 }}
      />
      <Button
        variant="contained"
        color={loading ? "secondary" : "primary"}
        endIcon={loading ? <StopIcon /> : <SendIcon />}
        sx={{ minWidth: 110, fontWeight: 600, fontSize: 17 }}
        onClick={loading ? handleStop : handleSend}
      >
        {loading ? "Stop" : "Send"}
      </Button>
    </Box>
  );
};

export default PromptBar;
