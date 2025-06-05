import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Select, MenuItem } from "@mui/material";

interface Props {
  model: string;
  setModel: (m: string) => void;
}

const Navbar: React.FC<Props> = ({ model, setModel }) => {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:8080/models");
        const data = await response.json();
        setModels(data.models || []);
      } catch (err) {
        console.log(err)
        setModels([]);
      }
      setLoading(false);
    };
    fetchModels();
  }, []);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "primary.main" }}>
          🧠 Local LLM Chat
        </Typography>
        <Box>
          <Select
            value={model}
            onChange={(e) => setModel(e.target.value as string)}
            size="small"
            sx={{ minWidth: 180 }}
            disabled={loading || models.length === 0}
          >
            {models.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
