import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { Message } from "../App";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
}

const ChatArea: React.FC<Props> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: { xs: 1, md: 10 },
        py: 2,
        bgcolor: "background.default",
      }}
    >
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatArea;
