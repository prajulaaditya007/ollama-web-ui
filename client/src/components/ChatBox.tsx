import React, { useState } from "react";
import { queryModel } from "../api";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dracula from "react-syntax-highlighter/dist/esm/styles/prism/dracula";

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
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]); // Add user question to chat
    setInput(""); // Clear input field

    setError(null);
    try {
      const result = await queryModel(model, input);
      const modelMessage: Message = {
        role: "model",
        content: result.response,
        model: result.model,
        time_taken: result.time_taken,
      };
      setMessages((prev) => [...prev, modelMessage]); // Append model response
    } catch (err) {
      setError("Failed to fetch response. Please try again.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return minutes > 0
      ? `${minutes} minute${minutes > 1 ? "s" : ""} ${remainingSeconds} second${
          remainingSeconds > 1 ? "s" : ""
        }`
      : `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;
  };

  const renderCodeBlock: React.FC<any> = ({
    node,
    inline,
    className,
    children,
    ...props
  }) => {
    const match = className ? /language-(\w+)/.exec(className) : null;
    const language = match ? match[1] : "";
    const value = String(children).replace(/\n$/, "");

    if (inline) {
      return (
        <code
          style={{
            backgroundColor: "#f5f5f5",
            padding: "2px 4px",
            borderRadius: "4px",
          }}
        >
          {value}
        </code>
      );
    }

    return (
      <div style={{ position: "relative" }}>
        <SyntaxHighlighter
          language={language}
          style={dracula}
          children={value}
          {...props}
        />
        <IconButton
          onClick={() => copyToClipboard(value)}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            zIndex: 1,
            color: "white",
          }}
        >
          <ContentCopyIcon />
        </IconButton>
      </div>
    );
  };

  return (
    <Box sx={{ width: "100%", mt: 2, m: 1 }}>
      <Stack spacing={2}>
        {/* Input Field */}
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
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          endIcon={<SendIcon />}
          sx={{ alignSelf: "flex-end" }}
        >
          Send
        </Button>

        {/* Error Message */}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {/* Chat History */}
        {messages.length > 0 && (
          <Paper elevation={3} sx={{ p: 2, mt: 2, bgcolor: "#f5f5f5" }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    color: msg.role === "user" ? "blue" : "green",
                    mb: 1,
                  }}
                >
                  {msg.role === "user" ? "You:" : `${msg.model}:`}
                </Typography>
                <ReactMarkdown
                  children={msg.content}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{ code: renderCodeBlock }}
                />
                {msg.role === "model" && msg.time_taken !== undefined && (
                  <Typography
                    variant="caption"
                    sx={{ fontStyle: "italic", mt: 1, display: "block" }}
                  >
                    {msg.model} responded in {formatTime(msg.time_taken)}
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default ChatBox;
