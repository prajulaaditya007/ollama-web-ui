import React, { useState } from "react";
import { Box, TextField, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import StopIcon from "@mui/icons-material/Stop";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { useMessageState, useChatActions } from "../context/ChatContext";

const PromptBar: React.FC = () => {
  const { loading } = useMessageState();
  const { sendMessage, stopGeneration } = useChatActions();
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2.5, sm: 3.5, md: 5 },
        pb: 2,
        pt: 1,
        bgcolor: "background.default",
        borderTop: "1px solid rgba(255, 255, 255, 0.04)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Spotlight-style compact Input Bar */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: 800 },
          bgcolor: "rgba(30, 30, 32, 0.75)",
          backdropFilter: "blur(20px)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
          p: 1.2,
          pl: 1.8,
          pr: 1.2,
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
          transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: "0 0 0 1.5px #007aff, 0 12px 32px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        {/* Core Input text field */}
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={6}
          placeholder="Message Ollama Studio..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: "text.primary",
              fontSize: "0.88rem", // compact macOS standard
              lineHeight: 1.45,
              fontWeight: 400,
              fontFamily: 'inherit',
            },
          }}
        />

        {/* Action button row inside input card */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.2 }}>
          {/* Mock attachment & voice icons for premium visual design */}
          <Box sx={{ display: "flex", gap: 0.5, color: "text.secondary" }}>
            <Tooltip title="Upload Files (Visual design)">
              <IconButton size="small" sx={{ color: "rgba(255, 255, 255, 0.3)", "&:hover": { color: "text.primary" } }}>
                <AttachFileIcon sx={{ fontSize: "1.05rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Voice Input (Visual design)">
              <IconButton size="small" sx={{ color: "rgba(255, 255, 255, 0.3)", "&:hover": { color: "text.primary" } }}>
                <KeyboardVoiceIcon sx={{ fontSize: "1.05rem" }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Core Send/Stop action button */}
          <Box>
            {loading ? (
              <Tooltip title="Stop generation">
                <IconButton
                  onClick={stopGeneration}
                  size="small"
                  sx={{
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                    color: "error.main",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    p: 0.7,
                    borderRadius: "6px",
                    "&:hover": {
                      bgcolor: "error.main",
                      color: "#fff",
                    },
                    transition: "all 0.15s ease",
                  }}
                >
                  <StopIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Send message">
                <IconButton
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  size="small"
                  sx={{
                    bgcolor: input.trim() ? "primary.main" : "rgba(255, 255, 255, 0.04)",
                    color: input.trim() ? "#fff" : "rgba(255, 255, 255, 0.15)",
                    p: 0.7,
                    borderRadius: "6px",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    transition: "all 0.15s ease",
                  }}
                >
                  <ArrowUpwardIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      {/* Sleek bottom disclaimer */}
      <Typography
        variant="caption"
        sx={{
          color: "rgba(255, 255, 255, 0.25)",
          mt: 0.8,
          fontSize: "0.7rem",
          fontWeight: 400,
          letterSpacing: "0.01em",
        }}
      >
        Ollama Studio can make mistakes. Verify important info.
      </Typography>
    </Box>
  );
};

export default PromptBar;
