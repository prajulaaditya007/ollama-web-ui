const API_BASE_URL = "http://localhost:8080/api";

export const streamModel = async (model: string, prompt: string) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: 1,
      session_id: 0,
      prompt,
      model_id: model,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to start model stream");
  }

  return response.body.getReader();
};
