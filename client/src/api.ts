export async function streamModel(
  model: string,
  prompt: string,
  history: boolean,
  priorResponse: string,
  signal?: AbortSignal
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const response = await fetch("http://localhost:8080/query-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, history, priorResponse }),
    signal,
  });
  if (!response.body) throw new Error("No response body");
  return response.body.getReader();
}
