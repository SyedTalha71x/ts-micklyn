// server ip 
export const baseUrl = "http://64.23.166.88:8016";
// export const baseUrl = "https://2ce24f676cd6.ngrok-free.app";

// this server api for the chat history & collection 
export const chatHistoryUrl = "http://64.23.166.88:5019";
// export const chatHistoryUrl = "http://192.168.18.10:5019";

// server ip of Python backend 
export const chatBaseUrl = "http://64.23.166.88:5019";
// export const chatBaseUrl = "http://192.168.18.10:5019";



export const FireApi = async (url, method, data = null, chatHistoryUrl) => {
  const token = localStorage.getItem("user-visited-dashboard");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(chatHistoryUrl ? chatHistoryUrl + url :baseUrl + url, options);
    console.log(response, "response");

    if (
      response.ok ||
      (response.statusText >= 200 && response.statusText < 300)
    ) {
      return response.json();
    } else {
      const error = await response.json();
      console.log(error, "error");
      throw new Error(error.message || "Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};