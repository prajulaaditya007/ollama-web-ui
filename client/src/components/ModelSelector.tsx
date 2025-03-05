import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

interface Props {
  model: string;
  setModel: (model: string) => void;
}

const ModelSelector: React.FC<Props> = ({ model, setModel }) => {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:8080/models");
        const data = await response.json();
        setModels(data.models);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return <Typography>Loading models...</Typography>;
  }

  if (models.length === 0) {
    return (
      <Typography>
        No model has been installed. Please install an LLM.{" "}
        <Link href="https://ollama.com/" target="_blank" rel="noopener">
          Here's a link to Ollama
        </Link>
      </Typography>
    );
  }

  return (
    <FormControl fullWidth variant="outlined" sx={{ m: 1 }}>
      <InputLabel id="model-select-label">Model</InputLabel>
      <Select
        labelId="model-select-label"
        id="model-select"
        value={model}
        label="Model"
        onChange={(e) => setModel(e.target.value)}
      >
        {models.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ModelSelector;