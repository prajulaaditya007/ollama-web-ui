import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import StopIcon from "@mui/icons-material/Stop";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import FileUploadModal, { ProcessedUpload } from "./FileUploadModal";
import {
  useChatActions,
  useMessageState,
  useSessionState,
} from "../context/useChatContext";

const PromptBar: React.FC = () => {
  const { loading } = useMessageState();
  const { dbError } = useSessionState();
  const { sendMessage, stopGeneration } = useChatActions();
  const [input, setInput] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeUpload, setActiveUpload] = useState<ProcessedUpload | null>(
    null,
  );

  const handleSubmit = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !activeUpload) return;

    const promptText = [
      trimmedInput || "Please analyze the attached file.",
      activeUpload?.fileLabel,
    ]
      .filter(Boolean)
      .join("\n\n");

    sendMessage(promptText, {
      images: activeUpload?.images,
      docText: activeUpload?.docText,
    });
    setInput("");
    setActiveUpload(null);
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
      {dbError && (
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: 800 },
            mb: 1.5,
          }}
        >
          <Alert
            severity="error"
            sx={{
              borderRadius: "10px",
              bgcolor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              "& .MuiAlert-icon": { color: "#f87171" },
              fontSize: "0.82rem",
              py: 0.5,
            }}
          >
            {dbError}
          </Alert>
        </Box>
      )}

      <FileUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onFileReady={setActiveUpload}
      />

      {/* Spotlight-style compact Input Bar */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: 800 },
          bgcolor: dbError
            ? "rgba(30, 30, 32, 0.45)"
            : "rgba(30, 30, 32, 0.75)",
          backdropFilter: "blur(20px)",
          borderRadius: "10px",
          border: dbError
            ? "1px solid rgba(239, 68, 68, 0.15)"
            : "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
          p: 1.2,
          pl: 1.8,
          pr: 1.2,
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
          transition:
            "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          "&:focus-within": dbError
            ? {}
            : {
                borderColor: "primary.main",
                boxShadow:
                  "0 0 0 1.5px #007aff, 0 12px 32px rgba(0, 0, 0, 0.3)",
              },
        }}
      >
        {activeUpload && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              label={activeUpload.fileName}
              onDelete={() => setActiveUpload(null)}
              size="small"
              sx={{
                maxWidth: "100%",
                bgcolor: "rgba(255, 255, 255, 0.06)",
                color: "text.primary",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
                "& .MuiChip-deleteIcon": {
                  color: "rgba(255, 255, 255, 0.45)",
                  "&:hover": { color: "text.primary" },
                },
              }}
            />
          </Box>
        )}

        {/* Core Input text field */}
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={6}
          placeholder={
            dbError
              ? "Chat disabled: connection failed to db, services are down"
              : "Message Ollama Studio..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || !!dbError}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: dbError ? "text.disabled" : "text.primary",
              fontSize: "0.88rem", // compact macOS standard
              lineHeight: 1.45,
              fontWeight: 400,
              fontFamily: "inherit",
            },
          }}
        />

        {/* Action button row inside input card */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.2,
          }}
        >
          {/* Mock attachment & voice icons for premium visual design */}
          <Box sx={{ display: "flex", gap: 0.5, color: "text.secondary" }}>
            <Tooltip title={dbError ? "Disabled" : "Upload file"}>
              <IconButton
                onClick={() => setUploadModalOpen(true)}
                disabled={loading || !!dbError}
                size="small"
                sx={{
                  color: activeUpload
                    ? "primary.main"
                    : "rgba(255, 255, 255, 0.3)",
                  "&:hover": { color: "text.primary" },
                }}
              >
                <AttachFileIcon sx={{ fontSize: "1.05rem" }} />
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
              <Tooltip title={dbError ? "Database offline" : "Send message"}>
                <IconButton
                  onClick={handleSubmit}
                  disabled={(!input.trim() && !activeUpload) || !!dbError}
                  size="small"
                  sx={{
                    bgcolor:
                      (input.trim() || activeUpload) && !dbError
                        ? "primary.main"
                        : "rgba(255, 255, 255, 0.04)",
                    color:
                      (input.trim() || activeUpload) && !dbError
                        ? "#fff"
                        : "rgba(255, 255, 255, 0.15)",
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
