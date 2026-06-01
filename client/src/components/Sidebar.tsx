import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Drawer,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ComputerIcon from "@mui/icons-material/Computer";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useSessionState, useChatActions } from "../context/useChatContext";
import SettingsModal from "./SettingsModal";

const DRAWER_WIDTH = 230;

const Sidebar: React.FC = () => {
  const { sessions, currentSessionId, setCurrentSessionId, sidebarOpen, dbError } = useSessionState();
  const { createNewSession, deleteSession, toggleSidebar } = useChatActions();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const onGoHome = () => {
    setCurrentSessionId(null);
  };

  // Reusable drawer content component
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "rgba(22, 22, 24, 0.9)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)"
      }}
    >
      {/* Header with macOS Traffic Lights & Title & Collapse button */}
      <Box
        sx={{
          px: 1.5,
          pt: 1.8,
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 48,
          WebkitAppRegion: "drag",
        }}
      >
        <Typography
          variant="subtitle2"
          onClick={onGoHome}
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "text.secondary",
            cursor: "pointer",
            letterSpacing: "0.01em",
            fontFamily: '"-apple-system", BlinkMacSystemFont, sans-serif',
            opacity: 0.7,
            userSelect: "none",
          }}
        >
          Ollama Studio
        </Typography>

        <Tooltip title="Collapse Sidebar">
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.light", bgcolor: "rgba(255, 255, 255, 0.04)" },
              p: 0.3,
              WebkitAppRegion: "no-drag",
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* "New Chat" Trigger CTA */}
      <Box sx={{ p: 1.5, pt: 0.5, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={createNewSession}
          disabled={!!dbError}
          startIcon={<AddIcon sx={{ fontSize: "0.95rem" }} />}
          sx={{
            py: 0.7,
            px: 1.5,
            bgcolor: "rgba(255, 255, 255, 0.05)",
            color: "text.primary",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.80rem",
            boxShadow: "none",
            justifyContent: "center",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
              boxShadow: "none",
            },
          }}
        >
          New Chat
        </Button>
      </Box>

      <Divider sx={{ mx: 1.5, opacity: 0.3 }} />

      {/* Scrollable list of chat sessions */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1, py: 1.5 }}>
        {sessions.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic", fontSize: "0.78rem" }}>
              No chats yet
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
            {sessions.map((session) => {
              const isSelected = session.id === currentSessionId;
              return (
                <ListItemButton
                  key={session.id}
                  onClick={() => {
                    setCurrentSessionId(session.id);
                  }}
                  sx={{
                    borderRadius: "6px",
                    py: 0.6,
                    px: 1.2,
                    position: "relative",
                    bgcolor: isSelected ? "primary.main" : "transparent", // macOS standard blue active background
                    color: isSelected ? "#ffffff" : "text.secondary",
                    transition: "all 0.1s ease-in-out",
                    "&:hover": {
                      bgcolor: isSelected ? "primary.main" : "rgba(255, 255, 255, 0.04)",
                      color: isSelected ? "#ffffff" : "text.primary",
                      "& .delete-btn": {
                        opacity: 0.85,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 26, color: isSelected ? "#ffffff" : "text.secondary" }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: "1rem" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={session.title}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: {
                        fontSize: "0.82rem",
                        fontWeight: isSelected ? 500 : 400,
                        color: "inherit",
                        pr: 2,
                      },
                    }}
                  />
                  {/* Hover delete icon button */}
                  <IconButton
                    className="delete-btn"
                    onClick={(e) => deleteSession(session.id, e)}
                    size="small"
                    sx={{
                      position: "absolute",
                      right: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      opacity: 0,
                      transition: "opacity 0.1s ease-in-out",
                      color: isSelected ? "rgba(255, 255, 255, 0.8)" : "text.secondary",
                      p: 0.2,
                      "&:hover": {
                        color: isSelected ? "#ffffff" : "error.main",
                        bgcolor: isSelected ? "rgba(255, 255, 255, 0.15)" : "rgba(239, 68, 68, 0.08)",
                      },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: "0.95rem" }} />
                  </IconButton>
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>

      <Divider sx={{ mx: 1.5, opacity: 0.3 }} />

      {/* Sidebar Footer */}
      <Box sx={{ p: 1.5, bgcolor: "rgba(0, 0, 0, 0.15)", borderTop: "1px solid rgba(255, 255, 255, 0.03)" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <ComputerIcon sx={{ color: "secondary.main", fontSize: "0.85rem" }} />
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", fontWeight: 500 }}>
              Localhost:8080
            </Typography>
          </Box>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: "secondary.main",
              boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
            Ollama Backend Active
          </Typography>
          <Tooltip title="Settings">
            <IconButton
              size="small"
              onClick={() => setSettingsOpen(true)}
              sx={{ color: "text.secondary", p: 0.2, "&:hover": { color: "primary.light" } }}
            >
              <SettingsIcon sx={{ fontSize: "0.85rem" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarOpen ? DRAWER_WIDTH : 0 },
          flexShrink: { sm: 0 },
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-label="chat history sessions"
      >
        {/* Mobile Drawer (Temporary, hidden on desktop sizes) */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={toggleSidebar}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile devices.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer (Persistent / Permanent, hidden on mobile screen sizes) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: sidebarOpen ? "block" : "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            },
          }}
          open={sidebarOpen}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;

