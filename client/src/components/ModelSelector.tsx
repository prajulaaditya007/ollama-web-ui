import React from "react";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface Props {
    model: string;
    setModel: (model: string) => void;
}

const ModelSelector: React.FC<Props> = ({ model, setModel }) => {
    const models = ["codeqwen:latest", "qwen2.5-coder:1.5b", "deepseek-coder:1.3b"];

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