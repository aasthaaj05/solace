export const sendMessage = async (message) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return { answer: "Sorry, there was an error processing your request." };
  }
};
