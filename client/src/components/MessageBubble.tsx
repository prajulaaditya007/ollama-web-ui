import React, { useState } from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";
import { Message } from "../context/chatTypes";

interface Props {
  msg: Message;
  isGenerating: boolean;
  totalSessionTokens?: number;
  inputTokens?: number;
}

// Stateful CodeBlock component with copy functionality
const CodeBlock: React.FC<{ language: string; value: string }> = ({
  language,
  value,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        borderRadius: "6px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        my: 1.5,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Header bar of CodeBlock */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "rgba(0, 0, 0, 0.35)",
          px: 2,
          py: 0.8,
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            textTransform: "lowercase",
            fontSize: "0.78rem",
            letterSpacing: "0.05em",
            fontFamily: 'monospace',
          }}
        >
          {language || "code"}
        </Typography>
        <Button
          size="small"
          onClick={handleCopy}
          startIcon={
            copied ? (
              <CheckIcon sx={{ fontSize: "0.9rem" }} />
            ) : (
              <ContentCopyIcon sx={{ fontSize: "0.9rem" }} />
            )
          }
          sx={{
            color: copied ? "secondary.main" : "text.secondary",
            fontSize: "0.76rem",
            py: 0.2,
            px: 1,
            textTransform: "none",
            "&:hover": {
              color: "text.primary",
              bgcolor: "rgba(255, 255, 255, 0.04)",
            },
          }}
        >
          {copied ? "Copied!" : "Copy code"}
        </Button>
      </Box>

      {/* Code Syntax Highlight */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        PreTag="div"
        wrapLongLines={true}
        customStyle={{
          margin: 0,
          background: "#161618",
          padding: "10px 14px",
          fontSize: "0.8rem",
          lineHeight: 1.45,
          fontFamily: '"SF Mono", "Fira Code", monospace',
          whiteSpace: "pre-wrap",
          wordBreak: "normal",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </Box>
  );
};

// Blinking cursor representing active generation
const CursorIndicator: React.FC = () => {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: "7px",
        height: "15px",
        ml: 0.5,
        bgcolor: "primary.main",
        verticalAlign: "middle",
        borderRadius: "2px",
        animation: "pulse 0.8s infinite alternate",
        "@keyframes pulse": {
          "0%": { opacity: 0.1 },
          "100%": { opacity: 1 },
        },
      }}
    />
  );
};

const MessageBubble: React.FC<Props> = ({ msg, isGenerating, totalSessionTokens = 0, inputTokens = 0 }) => {
  const isUser = msg.role === "user";

  // Markdown custom renderers
  const renderers = {
    code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
      const match = className ? /language-(\w+)/.exec(className) : null;
      const lang = match ? match[1] : "";
      const codeValue = String(children).replace(/\n$/, "");

      if (inline || !match) {
        return (
          <code
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "#fb7185", // bright accent pink for inline code
              padding: "2px 5px",
              borderRadius: "4px",
              fontSize: "0.85em",
              fontFamily: 'monospace',
            }}
            {...props}
          >
            {children}
          </code>
        );
      }

      return <CodeBlock language={lang} value={codeValue} />;
    },
    // Stylize links
    a({ href, children }: React.ComponentPropsWithoutRef<"a">) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#47a1ff", textDecoration: "none", fontWeight: 500 }}
        >
          {children}
        </a>
      );
    },
    // Stylize lists
    ul({ children }: React.ComponentPropsWithoutRef<"ul">) {
      return <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>{children}</ul>;
    },
    ol({ children }: React.ComponentPropsWithoutRef<"ol">) {
      return <ol style={{ paddingLeft: "20px", margin: "4px 0" }}>{children}</ol>;
    },
    li({ children }: React.ComponentPropsWithoutRef<"li">) {
      return <li style={{ margin: "2px 0", lineHeight: 1.5 }}>{children}</li>;
    },
    // Stylize paragraphs
    p({ children }: React.ComponentPropsWithoutRef<"p">) {
      return <p style={{ margin: "4px 0 10px 0", lineHeight: 1.5 }}>{children}</p>;
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: isUser ? "flex-end" : "flex-start",
        my: 1.5,
        gap: 1.5,
        alignItems: "flex-start",
      }}
    >
      {/* Model Avatar on the Left (only for Model) */}
      {!isUser && (
        <Avatar
          sx={{
            width: 28,
            height: 28,
            background: "#007aff",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <AutoAwesomeIcon sx={{ color: "#fff", fontSize: "0.9rem" }} />
        </Avatar>
      )}

      {/* Message Content Container */}
      <Box
        sx={{
          maxWidth: isUser ? "85%" : "calc(100% - 20px)",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {/* Model Metadata Tag */}
        {!isUser && (
          <Typography
            variant="caption"
            sx={{
              color: "primary.light",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.03em",
              mb: 0.4,
              opacity: 0.9,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {"AI ASSISTANT"}
          </Typography>
        )}

        {/* Bubble Text Body */}
        <Box
          sx={{
            bgcolor: isUser ? "rgba(255, 255, 255, 0.05)" : "transparent",
            color: "text.primary",
            px: isUser ? 2 : 0,
            py: isUser ? 1.2 : 0,
            borderRadius: isUser ? "10px 10px 3px 10px" : 0,
            border: isUser ? "1px solid rgba(255, 255, 255, 0.06)" : "none",
            fontSize: "0.92rem",
            fontFamily: "inherit",
            wordBreak: "break-word",
            "& > p:first-of-type": { mt: 0 },
            "& > p:last-of-type": { mb: 0 },
          }}
        >
          <ReactMarkdown
            children={msg.content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={renderers}
          />
          {isGenerating && <CursorIndicator />}
        </Box>
        {!isUser && (inputTokens > 0 || (msg.tokenCount ?? 0) > 0 || totalSessionTokens > 0) && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              mt: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: 0.8,
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              pt: 1,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {inputTokens > 0 || (msg.tokenCount && msg.tokenCount > 0) ? (
                <>
                  <span style={{ opacity: 0.6 }}>⚡ Turn Tokens:</span>
                  <span>
                    Input: <strong style={{ color: "#a5b4fc" }}>{inputTokens}</strong>
                    {" • "}
                    Output: <strong style={{ color: "#818cf8" }}>{msg.tokenCount || 0}</strong>
                  </span>
                </>
              ) : null}
            </Box>
            {totalSessionTokens > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.7 }}>
                <span>📊 Session Telemetry:</span>
                <span>Total utilised: <strong style={{ color: "#10b981" }}>{totalSessionTokens}</strong></span>
              </Box>
            )}
          </Typography>
        )}
      </Box>

      {/* User Avatar on the Right (only for User) */}
      {isUser && (
        <Avatar
          sx={{
            width: 28,
            height: 28,
            bgcolor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
          }}
        >
          <PersonIcon sx={{ color: "text.secondary", fontSize: "0.95rem" }} />
        </Avatar>
      )}
    </Box>
  );
};

export default MessageBubble;
