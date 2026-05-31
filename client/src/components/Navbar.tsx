import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useSessionState, useChatActions } from "../context/ChatContext";

interface Props {
  model: string;
  setModel: (m: string) => void;
  onSignOut?: () => void;
}

const Navbar: React.FC<Props> = ({
  model,
  setModel,
  onSignOut,
}) => {
  const { sidebarOpen } = useSessionState();
  const { toggleSidebar } = useChatActions();
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("ollama_current_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          setUserEmail(parsed.email);
        }
      } catch (e) {
        console.error("Failed to parse user email inside Navbar:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:8080/models");
        const data = await response.json();
        const modelList = data.models || [];
        setModels(modelList);

        // If current model is not in the list but models exist, default to the first one
        if (modelList.length > 0 && !modelList.includes(model)) {
          setModel(modelList[0]);
        }
      } catch (err) {
        console.error("Failed to fetch models in Navbar:", err);
        setModels([]);
      }
      setLoading(false);
    };
    fetchModels();
  }, [model, setModel]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(30, 30, 32, 0.75)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        top: 0,
        zIndex: 100,
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1.5,
          minHeight: "48px !important", // macOS slim toolbar
          height: 48,
        }}
      >
        {/* Left Section: Traffic Lights (when sidebar closed) + Expand Button + Model Selector */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {!sidebarOpen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Expand Sidebar">
                <IconButton
                  onClick={toggleSidebar}
                  edge="start"
                  size="small"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "primary.light", bgcolor: "rgba(255, 255, 255, 0.04)" },
                    p: 0.3,
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: "1.1rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Model Selector Pill */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              bgcolor: "rgba(255, 255, 255, 0.04)",
              px: 1.2,
              py: 0.4,
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              transition: "border-color 0.15s ease",
              "&:hover": { borderColor: "rgba(255,255,255,0.1)" },
            }}
          >
            {/* Live status dot */}
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: models.length > 0 ? "#27c93f" : "#ff5f57",
                boxShadow: models.length > 0
                  ? "0 0 5px rgba(39, 201, 63, 0.7)"
                  : "0 0 5px rgba(255, 95, 87, 0.7)",
                flexShrink: 0,
              }}
            />
            <Select
              value={model}
              onChange={(e) => setModel(e.target.value as string)}
              size="small"
              disabled={loading || models.length === 0}
              variant="standard"
              disableUnderline
              sx={{
                minWidth: 120,
                maxWidth: 200,
                fontSize: "0.8rem",
                fontWeight: 500,
                fontFamily: 'inherit',
                color: "text.primary",
                "& .MuiSelect-select": {
                  py: 0,
                  pr: "18px !important",
                  "&:focus": { backgroundColor: "transparent" },
                },
                "& .MuiSelect-icon": {
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "1rem",
                  right: 0,
                },
              }}
            >
              {loading ? (
                <MenuItem value={model} sx={{ fontSize: "0.8rem" }}>Loading...</MenuItem>
              ) : models.length === 0 ? (
                <MenuItem value="" sx={{ fontSize: "0.8rem" }}>No Models</MenuItem>
              ) : (
                models.map((m) => (
                  <MenuItem
                    key={m}
                    value={m}
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      borderRadius: "4px",
                      mx: 0.5,
                      my: 0.1,
                    }}
                  >
                    {m}
                  </MenuItem>
                ))
              )}
            </Select>
          </Box>
        </Box>

        {/* Middle Section: Empty for clean macOS toolbar feel */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section: System info, profile avatar pill, and Logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Local System Running">
            <IconButton size="small" sx={{ color: "text.secondary", p: 0.4 }}>
              <CloudQueueIcon sx={{ fontSize: "1.15rem" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help & Documentation">
            <IconButton
              size="small"
              href="https://github.com/ollama/ollama"
              target="_blank"
              sx={{ color: "text.secondary", p: 0.4 }}
            >
              <HelpOutlineIcon sx={{ fontSize: "1.15rem" }} />
            </IconButton>
          </Tooltip>

          {/* User Profile avatar pill and Logout */}
          {userEmail && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(255, 255, 255, 0.05)",
                px: 1,
                py: 0.4,
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.04)",
              }}
            >
              <Avatar
                sx={{
                  width: 18,
                  height: 18,
                  fontSize: "0.7rem",
                  bgcolor: "primary.main",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {userEmail[0].toUpperCase()}
              </Avatar>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {userEmail.split("@")[0]}
              </Typography>
              <Box sx={{ width: 1, height: 10, bgcolor: "rgba(255, 255, 255, 0.1)", display: { xs: "none", sm: "block" } }} />
              <Tooltip title="Sign Out">
                <IconButton
                  size="small"
                  onClick={onSignOut}
                  sx={{
                    color: "text.secondary",
                    p: 0.1,
                    "&:hover": { color: "error.main" },
                    transition: "all 0.15s ease",
                  }}
                >
                  <LogoutIcon sx={{ fontSize: "0.85rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
