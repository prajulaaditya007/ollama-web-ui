import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Link,
  CircularProgress,
  Tooltip,
  TextField,
  Button,
  Collapse,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useCurrentUser } from "../context/UserContext";

// ── Reusable sub-components ───────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    variant="overline"
    sx={{
      color: "text.secondary",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.1em",
      mb: 1,
      display: "block",
      opacity: 0.6,
    }}
  >
    {children}
  </Typography>
);

const InfoRow: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      py: 1.2,
      px: 1.5,
      borderRadius: "8px",
      bgcolor: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
    }}
  >
    {icon && (
      <Box sx={{ color: "primary.light", display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
    )}
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.68rem", display: "block", mb: 0.2 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.primary", fontSize: "0.88rem", fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

// ── Main Component ────────────────────────────────────────────────────────────

const SettingsModal: React.FC<Props> = ({ open, onClose }) => {
  const { currentUser, updateUsername } = useCurrentUser();

  // LLM model list
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // Username editing state
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  // Fetch models each time modal opens
  useEffect(() => {
    if (!open) return;
    setLoadingModels(true);
    fetch("http://localhost:8080/api/models")
      .then((r) => r.json())
      .then((data) => setModels(data.models || []))
      .catch(() => setModels([]))
      .finally(() => setLoadingModels(false));
  }, [open]);

  // Reset editing state when modal closes
  useEffect(() => {
    if (!open) {
      setEditingUsername(false);
      setUsernameError(null);
      setUsernameSuccess(false);
    }
  }, [open]);

  // Seed the text field from current value whenever edit mode opens
  useEffect(() => {
    if (editingUsername) {
      setUsernameInput(currentUser?.username || "");
    }
  }, [editingUsername, currentUser?.username]);

  const handleSaveUsername = async () => {
    if (!currentUser) return;
    const trimmed = usernameInput.trim();

    if (trimmed.length < 2 || trimmed.length > 50) {
      setUsernameError("Username must be between 2 and 50 characters.");
      return;
    }

    setSavingUsername(true);
    setUsernameError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/user/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${res.status})`);
      }

      updateUsername(trimmed);
      setEditingUsername(false);
      setUsernameSuccess(true);
      setTimeout(() => setUsernameSuccess(false), 3000);
    } catch (err) {
      setUsernameError(err instanceof Error ? err.message : "Failed to save username.");
    } finally {
      setSavingUsername(false);
    }
  };

  // Derived display values
  const displayName = currentUser?.username || currentUser?.email?.split("@")[0] || "—";
  const avatarInitial = displayName[0]?.toUpperCase() ?? "?";
  const maskedPassword = "••••••••••••";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "rgba(18, 18, 20, 0.97)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          boxShadow: "0 32px 80px rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Modal Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          pt: 2.5,
          pb: 1.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ fontSize: "1rem", color: "#fff" }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem", color: "text.primary" }}>
            Settings
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary", bgcolor: "rgba(255, 255, 255, 0.06)" },
          }}
        >
          <CloseIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2.5, py: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>

        {/* ── Account Section ── */}
        <Box>
          <SectionLabel>Account</SectionLabel>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

            {/* Success banner */}
            <Collapse in={usernameSuccess}>
              <Alert
                severity="success"
                icon={<CheckIcon sx={{ fontSize: "0.9rem" }} />}
                sx={{
                  mb: 0.5,
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  py: 0.4,
                  bgcolor: "rgba(39, 201, 63, 0.08)",
                  border: "1px solid rgba(39, 201, 63, 0.2)",
                  color: "secondary.light",
                  "& .MuiAlert-icon": { color: "secondary.main" },
                }}
              >
                Username saved successfully!
              </Alert>
            </Collapse>

            {/* Hero card — avatar + name + edit button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: 1.5,
                px: 1.5,
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(129, 140, 248, 0.06) 100%)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {avatarInitial}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                  {currentUser?.email}
                </Typography>
              </Box>
              {/* Toggle edit mode */}
              <Tooltip title={editingUsername ? "Cancel editing" : "Edit username"}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditingUsername((v) => !v);
                    setUsernameError(null);
                  }}
                  sx={{
                    color: editingUsername ? "text.secondary" : "primary.light",
                    p: 0.5,
                    borderRadius: "6px",
                    flexShrink: 0,
                    "&:hover": {
                      bgcolor: editingUsername
                        ? "rgba(255, 255, 255, 0.06)"
                        : "rgba(99, 102, 241, 0.12)",
                    },
                  }}
                >
                  {editingUsername
                    ? <CloseIcon sx={{ fontSize: "0.9rem" }} />
                    : <EditIcon sx={{ fontSize: "0.9rem" }} />
                  }
                </IconButton>
              </Tooltip>
            </Box>

            {/* Inline username editor — slides in */}
            <Collapse in={editingUsername}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, pt: 0.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Display Name"
                  placeholder="e.g. vader or Darth Vader"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setUsernameError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveUsername();
                    if (e.key === "Escape") setEditingUsername(false);
                  }}
                  disabled={savingUsername}
                  error={!!usernameError}
                  helperText={usernameError ?? `${usernameInput.length}/50`}
                  inputProps={{ maxLength: 50 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                      fontSize: "0.85rem",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "0.7rem",
                      color: usernameError ? "error.main" : "text.secondary",
                      textAlign: "right",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveUsername}
                  disabled={savingUsername || usernameInput.trim().length < 2}
                  startIcon={
                    savingUsername
                      ? <CircularProgress size={12} color="inherit" />
                      : <CheckIcon sx={{ fontSize: "0.9rem !important" }} />
                  }
                  sx={{
                    alignSelf: "flex-end",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    py: 0.7,
                    px: 1.8,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                    "&:disabled": { bgcolor: "rgba(255, 255, 255, 0.06)", color: "text.disabled" },
                  }}
                >
                  {savingUsername ? "Saving…" : "Save"}
                </Button>
              </Box>
            </Collapse>

            <InfoRow
              label="Email"
              value={currentUser?.email ?? "—"}
              icon={<PersonIcon sx={{ fontSize: "1rem" }} />}
            />
            <InfoRow
              label="Password"
              value={maskedPassword}
              icon={<LockIcon sx={{ fontSize: "1rem" }} />}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />

        {/* ── Installed LLMs ── */}
        <Box>
          <SectionLabel>Installed LLMs</SectionLabel>
          {loadingModels ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={20} sx={{ color: "primary.light" }} />
            </Box>
          ) : models.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.82rem", textAlign: "center", py: 1.5 }}>
              No models found. Pull one from Ollama.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {models.map((m) => (
                <Tooltip key={m} title={`Active: ${m}`} placement="top">
                  <Chip
                    label={m}
                    size="small"
                    icon={
                      <Box sx={{ display: "flex", alignItems: "center", pl: 0.5 }}>
                        <SmartToyIcon sx={{ fontSize: "0.78rem", color: "primary.light" }} />
                      </Box>
                    }
                    sx={{
                      bgcolor: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.25)",
                      color: "primary.light",
                      fontSize: "0.76rem",
                      height: 26,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />

        {/* ── Get More Models ── */}
        <Box>
          <SectionLabel>Get More Models</SectionLabel>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.2,
              px: 1.5,
              borderRadius: "8px",
              bgcolor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary", fontSize: "0.85rem" }}>
                Ollama Model Library
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
                Browse &amp; pull hundreds of open-source LLMs
              </Typography>
            </Box>
            <Link href="https://ollama.com/library" target="_blank" rel="noopener noreferrer" underline="none">
              <IconButton
                size="small"
                sx={{
                  color: "primary.light",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: "6px",
                  p: 0.6,
                  "&:hover": {
                    bgcolor: "rgba(99, 102, 241, 0.12)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <OpenInNewIcon sx={{ fontSize: "0.95rem" }} />
              </IconButton>
            </Link>
          </Box>

          {/* Pull command hint */}
          <Box
            sx={{
              mt: 1,
              py: 0.9,
              px: 1.5,
              borderRadius: "8px",
              bgcolor: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: "0.85rem", color: "secondary.main" }} />
            <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", color: "text.secondary" }}>
              ollama pull &lt;model-name&gt;
            </Typography>
          </Box>
        </Box>

        {/* ── Footer ── */}
        <Box sx={{ pt: 0.5, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.68rem", opacity: 0.5 }}>
            Ollama Studio · User ID #{currentUser?.id}
          </Typography>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
