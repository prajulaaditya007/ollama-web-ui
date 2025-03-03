import React from "react";

interface Props {
    model: string;
    setModel: (model: string) => void;
}

const ModelSelector: React.FC<Props> = ({ model, setModel }) => {
    const models = ["codeqwen:latest", "qwen2.5-coder:1.5b", "deepseek-coder:1.3b"];

    return (
        <select value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => (
                <option key={m} value={m}>
                    {m}
                </option>
            ))}
        </select>
    );
};

export default ModelSelector;
