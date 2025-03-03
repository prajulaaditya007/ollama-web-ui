import React, { useState } from "react";
import ChatBox from "./components/ChatBox";
import ModelSelector from "./components/ModelSelector";

const App: React.FC = () => {
    const [model, setModel] = useState("qwen2.5-coder:1.5b");

    return (
        <div>
            <h1>Local LLM Chat</h1>
            <ModelSelector model={model} setModel={setModel} />
            <ChatBox model={model} />
        </div>
    );
};

export default App;
