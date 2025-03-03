import React, { useState } from "react";
import { queryModel } from "../api";

interface Props {
    model: string;
}

const ChatBox: React.FC<Props> = ({ model }) => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleSend = async () => {
        const result = await queryModel(model, input);
        setResponse(result);
    };

    return (
        <div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." />
            <button onClick={handleSend}>Send</button>
            <div><strong>Response:</strong> {response}</div>
        </div>
    );
};

export default ChatBox;
