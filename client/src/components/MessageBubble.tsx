import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dracula from "react-syntax-highlighter/dist/esm/styles/prism/dracula";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Message } from "../App";

const renderCodeBlock = ({
  inline,
  className,
  children,
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  const match = className ? /language-(\w+)/.exec(className) : null;
  const lang = match ? match[1] : "";

  if (inline) {
    // For inline code, just use a plain code tag with light styles
    return (
      <code
        style={{
          backgroundColor: "#23272f",
          color: "#66ffb2",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "1em",
          fontFamily: "monospace",
          // No display block here!
        }}
      >
        {children}
      </code>
    );
  }

  // Only for triple-backtick code blocks:
  const codeString = String(children).replace(/\n$/, "");

  return (
    <Box sx={{ position: "relative", my: 1 }}>
      <SyntaxHighlighter
        language={lang}
        style={dracula}
        PreTag="div"
        customStyle={{ margin: 0, background: "#181b20" }}
      >
        {codeString}
      </SyntaxHighlighter>
      <IconButton
        onClick={() => navigator.clipboard.writeText(codeString)}
        size="small"
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          color: "#fff",
          background: "rgba(30,30,30,0.5)",
          "&:hover": { background: "#444" },
        }}
      >
        <ContentCopyIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};


const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
      my: 1.5,
    }}
  >
    <Box
      sx={{
        maxWidth: "80%",
        bgcolor: msg.role === "user" ? "#1976d2" : "#22272e",
        color: msg.role === "user" ? "#fff" : "#e3e3e3",
        px: 3,
        py: 1.5,
        borderRadius: 3,
        boxShadow: 2,
        fontSize: "1.09rem",
        fontFamily: "inherit",
        whiteSpace: "pre-wrap",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: msg.role === "user" ? "#89c4ff" : "#66ffb2",
          mb: 0.5,
          fontWeight: 600,
          fontSize: "0.95em",
          opacity: 0.7,
        }}
      >
        {msg.role === "user" ? "You" : (msg.model ?? "Model")}
      </Typography>
      <ReactMarkdown
        children={msg.content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ code: renderCodeBlock }}
      />
    </Box>
  </Box>
);

export default MessageBubble;
