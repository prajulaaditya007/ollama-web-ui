import axios from "axios";

const API_URL = "http://localhost:8080/query";

// Send a request to the backend
export const queryModel = async (
  model: string,
  prompt: string,
  history: boolean,
  priorResponse: string
) => {
  try {
    const response = await axios.post(API_URL, {
      model,
      prompt,
      history,
      priorResponse,
    });
    return response.data;
  } catch (error) {
    console.error("Error querying the model:", error);
    return "Failed to fetch response.";
  }
};
