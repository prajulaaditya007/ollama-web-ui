import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface PromptCard {
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  accentColor: string;
}

interface Props {
  onSelectPrompt: (prompt: string) => void;
}

const WelcomeScreen: React.FC<Props> = ({ onSelectPrompt }) => {
  const promptCards: PromptCard[] = [
    {
      title: "Explain Code",
      description: "Understand complex algorithms or explain how hooks work.",
      prompt: "Explain how React hooks work under the hood with a simple analogy.",
      icon: <CodeIcon sx={{ fontSize: "1.3rem" }} />,
      accentColor: "#6366f1",
    },
    {
      title: "Creative Writing",
      description: "Draft emails, blog structures, or short stories.",
      prompt: "Write a creative pitch for a brand that sells solar-powered backpacks.",
      icon: <BorderColorIcon sx={{ fontSize: "1.3rem" }} />,
      accentColor: "#10b981",
    },
    {
      title: "Brainstorm Ideas",
      description: "Generate novel ideas for projects, features, or designs.",
      prompt: "Give me 5 unique feature ideas for a personal coding portfolio website.",
      icon: <LightbulbIcon sx={{ fontSize: "1.3rem" }} />,
      accentColor: "#f59e0b",
    },
    {
      title: "Learn Concepts",
      description: "Break down difficult topics into bite-sized summaries.",
      prompt: "Explain quantum computing in simple terms so a 10-year-old can understand it.",
      icon: <AutoAwesomeIcon sx={{ fontSize: "1.3rem" }} />,
      accentColor: "#ec4899",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        px: 3,
        py: 4,
        textAlign: "center",
        maxWidth: 680,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Ambient Background Glows */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 250,
          background:
            "radial-gradient(ellipse at center, rgba(0, 122, 255, 0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          width: 220,
          height: 220,
          background:
            "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Logo Icon with animated glow */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #007aff 0%, #5856d6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px rgba(0, 122, 255, 0.25)",
          mb: 2.5,
          zIndex: 1,
          animation: "logoGlow 3s ease-in-out infinite alternate",
          "@keyframes logoGlow": {
            "0%": {
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px rgba(0, 122, 255, 0.25)",
            },
            "100%": {
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.12), 0 8px 36px rgba(88, 86, 214, 0.4)",
            },
          },
        }}
      >
        <AutoAwesomeIcon sx={{ color: "#fff", fontSize: "1.5rem" }} />
      </Box>

      {/* Greeting Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background:
            "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.72) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1,
          fontFamily: "inherit",
          letterSpacing: "-0.025em",
          fontSize: { xs: "1.45rem", md: "1.85rem" },
          zIndex: 1,
        }}
      >
        What can I help you with?
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 3.5,
          maxWidth: 400,
          fontSize: "0.83rem",
          fontWeight: 400,
          lineHeight: 1.6,
          zIndex: 1,
        }}
      >
        Ask anything — code, ideas, analysis, writing. Everything runs locally
        on your machine.
      </Typography>

      {/* Prompt Card Grid */}
      <Grid container spacing={1.5} sx={{ width: "100%", zIndex: 1 }}>
        {promptCards.map((card, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card
              onClick={() => onSelectPrompt(card.prompt)}
              sx={{
                height: "100%",
                cursor: "pointer",
                bgcolor: "rgba(255,255,255,0.025)",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                textAlign: "left",
                transition: "all 0.18s ease-in-out",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(8px)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: `${card.accentColor}80`,
                  boxShadow: `0 8px 24px rgba(0, 0, 0, 0.3)`,
                  bgcolor: "rgba(255,255,255,0.04)",
                },
                // Colored top accent line on hover
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: card.accentColor,
                  opacity: 0,
                  transition: "opacity 0.18s ease",
                },
                "&:hover::before": {
                  opacity: 1,
                },
              }}
            >
              <CardContent sx={{ p: 1.8, "&:last-child": { pb: 1.8 } }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: `${card.accentColor}18`,
                    color: card.accentColor,
                    mb: 1.2,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 0.4,
                    fontSize: "0.84rem",
                    color: "text.primary",
                    fontFamily: "inherit",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.45,
                    fontSize: "0.76rem",
                  }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WelcomeScreen;
