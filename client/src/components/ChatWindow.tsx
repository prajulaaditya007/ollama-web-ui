import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import MessageBubble from "./MessageBubble";
import WelcomeScreen from "./WelcomeScreen";
import { useMessageState, useChatActions } from "../context/ChatContext";

const ChatWindow: React.FC = () => {
	const { messages, loading } = useMessageState();
	const { sendMessage } = useChatActions();
	const bottomRef = useRef<HTMLDivElement>(null);

	// Smoothly scrolls feed to the bottom anchor upon message arrival or stream updates
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);

	// Render landing screen if session is empty
	if (messages?.length === 0) {
		return (
			<Box sx={{ flex: 1, overflowY: "auto", display: "flex", alignItems: "center" }}>
				<WelcomeScreen onSelectPrompt={(prompt) => sendMessage(prompt)} />
			</Box>
		);
	}

	// Calculate overall session token accumulations
	const totalTokensUsed = messages?.reduce((acc, m) => acc + (m.tokenCount || 0), 0);

	return (
		<Box
			sx={{
				flex: 1,
				overflowY: "auto",
				bgcolor: "background.default",
				position: "relative",
			}}
		>
			<Box
				sx={{
					maxWidth: 800,
					mx: "auto",
					px: { xs: 2.5, sm: 3.5, md: 5 },
					py: 3,
					pb: 10,
					display: "flex",
					flexDirection: "column",
					gap: 0.5,
				}}
			>
				{/* Individual Message Turns */}
				{messages?.map((msg, idx) => {
					const isLast = idx === messages.length - 1;
					let inputTokens = 0;
					if (msg.role === "model" && idx > 0) {
						const prevMsg = messages[idx - 1];
						if (prevMsg.role === "user") {
							inputTokens = prevMsg.tokenCount || 0;
						}
					}
					return (
						<MessageBubble
							key={msg.id ? `msg-db-${msg.id}` : `msg-temp-${idx}`}
							msg={msg}
							isGenerating={loading && isLast}
							totalSessionTokens={totalTokensUsed}
							inputTokens={inputTokens}
						/>
					);
				})}
				<div ref={bottomRef} style={{ height: 1 }} />
			</Box>
		</Box>
	);
};

export default ChatWindow;
