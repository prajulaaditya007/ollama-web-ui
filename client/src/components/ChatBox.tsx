import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { streamModel } from "../api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Message {
  role: "user" | "model";
  content: string;
  model?: string;
  time_taken?: number;
}

interface Props {
  model: string;
}

const ChatBox: React.FC<Props> = ({ model }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 👇 helper to always scroll to bottom when new content
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async () => {
    if (!input.trim() || !model) return;
    setError(null);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);
    setInput("");

    // Add model message placeholder
    setMessages((prev) => [
      ...prev,
      { role: "model", content: "", model: model },
    ]);
    scrollToBottom();

    try {
      // Streaming reader
      const reader = await streamModel(model, input, false, "");
      let done = false;
      let buffer = "";
      while (!done) {
        const { value, done: isDone } = await reader.read();
        if (value) {
          const chunk = new TextDecoder().decode(value);
          // The backend sends line-delimited JSON
          for (const line of chunk.split("\n")) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (typeof data.response === "string") {
                buffer += data.response;
                setMessages((prev) => {
                  // Update last model message content
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
                scrollToBottom();
              }
            } catch (err) {
              // ignore JSON parse errors for partial lines
              console.log(err)
            }
          }
        }
        done = isDone;
      }
    } catch (err) {
      setError("Streaming failed: " + (err as Error).message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          variant="outlined"
          label="Your Question"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          endIcon={<SendIcon />}
          disabled={loading}
          sx={{ alignSelf: "flex-end" }}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        {messages.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mt: 2,
              bgcolor: "#23272f",
              color: "#e3e3e3",
              minHeight: 300,
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.role === "user" ? "#1976d2" : "#313540",
                    color: msg.role === "user" ? "#fff" : "#e3e3e3",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: 2,
                    maxWidth: "80%",
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                  }}
                >
                  {msg.role === "model" && msg.model ? (
                    <span style={{ fontSize: 12, opacity: 0.7 }}>
                      {msg.model}
                      <br />
                    </span>
                  ) : null}
                  <ReactMarkdown
                    children={msg.content}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  />
                </Box>
              </Box>
            ))}
            <div ref={scrollRef} />
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default ChatBox;
