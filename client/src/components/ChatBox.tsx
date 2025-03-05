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
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dracula from "react-syntax-highlighter/dist/esm/styles/prism/dracula"; // Corrected import

interface Props {
  model: string;
}

const ChatBox: React.FC<Props> = ({ model }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<{
    response: string;
    model: string;
    time_taken?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setError(null);
    try {
      const result = await queryModel(model, input);
      setResponse(result);
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
      ? `${minutes} minute${minutes > 1 ? "s" : ""} ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
      : `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;
  };

  const renderCodeBlock: React.FC<any> = ({
    className,
    children,
    ...props
  }) => {
    const match = className ? /language-(\w+)/.exec(className) : null;
    const language = match ? match[1] : "";
    const value = String(children).replace(/\n$/, '');

    return (
      <div style={{ position: "relative" }}>
        <SyntaxHighlighter language={language} style={dracula} children={value} {...props} />
        <IconButton
          onClick={() => copyToClipboard(value)}
          style={{ position: "absolute", top: "5px", right: "5px", zIndex: 1, color: "white" }}
        >
          <ContentCopyIcon />
        </IconButton>
      </div>
    );
  };

  return (
    <Box sx={{ width: "100%", mt: 2, m: 1 }}>
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

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {response && (
          <Paper elevation={3} sx={{ p: 2, mt: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Response:
            </Typography>
            <ReactMarkdown
              children={response.response}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code: renderCodeBlock,
              }}
            />
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 2, fontStyle: "italic" }}
            >
              {response.model} provided solution in {response.time_taken ? formatTime(response.time_taken) : "N/A"}
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default ChatBox;