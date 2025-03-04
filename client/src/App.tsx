import React, { useState } from "react";
import ChatBox from "./components/ChatBox";
import ModelSelector from "./components/ModelSelector";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const App: React.FC = () => {
    const [model, setModel] = useState("qwen2.5-coder:1.5b");

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Local LLM Chat
                </Typography>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <ModelSelector model={model} setModel={setModel} />
                    <ChatBox model={model} />
                </Paper>
            </Box>
        </Container>
    );
};

export default App;