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
      icon: <CodeIcon sx={{ color: "#6366f1", fontSize: "1.8rem" }} />,
    },
    {
      title: "Creative Writing",
      description: "Draft emails, blog structures, or short stories.",
      prompt: "Write a creative pitch for a brand that sells solar-powered backpacks.",
      icon: <BorderColorIcon sx={{ color: "#10b981", fontSize: "1.8rem" }} />,
    },
    {
      title: "Brainstorm Ideas",
      description: "Generate novel ideas for projects, features, or designs.",
      prompt: "Give me 5 unique feature ideas for a personal coding portfolio website.",
      icon: <LightbulbIcon sx={{ color: "#fbbf24", fontSize: "1.8rem" }} />,
    },
    {
      title: "Learn Concepts",
      description: "Break down difficult topics into bite-sized summaries.",
      prompt: "Explain quantum computing in simple terms so a 10-year-old can understand it.",
      icon: <AutoAwesomeIcon sx={{ color: "#ec4899", fontSize: "1.8rem" }} />,
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
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {/* Sleek Logo Accent */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "10px",
          background: "#007aff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0, 122, 255, 0.2)",
          mb: 2,
        }}
      >
        <AutoAwesomeIcon sx={{ color: "#fff", fontSize: "1.4rem" }} />
      </Box>

      {/* Greeting Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1,
          fontFamily: 'inherit',
          letterSpacing: "-0.02em",
          fontSize: { xs: "1.6rem", md: "2.1rem" },
        }}
      >
        What can I help you discover?
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3,
          maxWidth: 460,
          fontSize: "0.88rem",
          fontWeight: 400,
          lineHeight: 1.5,
        }}
      >
        Ask a question, brainstorm ideas, or generate code. Everything runs 100% locally on your machine.
      </Typography>

      {/* Prompt Card Grid */}
      <Grid container spacing={2} sx={{ width: "100%" }}>
        {promptCards.map((card, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card
              onClick={() => onSelectPrompt(card.prompt)}
              sx={{
                height: "100%",
                cursor: "pointer",
                bgcolor: "background.paper",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                textAlign: "left",
                transition: "all 0.15s ease-in-out",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: "#007aff",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ mb: 1.2, display: "inline-block" }}>{card.icon}</Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: "0.88rem",
                    color: "text.primary",
                    fontFamily: 'inherit',
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.45,
                    fontSize: "0.78rem",
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
