// server ip
export const baseUrl = "http://64.23.166.88:8016";
// export const baseUrl = "http://192.168.18.33:8001";

// this server api for the chat history & collection
// export const chatHistoryUrl = "http://64.23.166.88:5019";
export const chatHistoryUrl = "http://192.168.18.14:5019";

// server ip of Python backend
// export const chatBaseUrl = "http://64.23.166.88:5019";
export const chatBaseUrl = "http://192.168.18.14:5019";

export const FireApi = async (url, method, data = null, chatHistoryUrl) => {
  const token = localStorage.getItem("user-visited-dashboard");
  const unauthorizedToken = localStorage.getItem("unauthorized-token");

  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    Authorization: `Bearer ${unauthorizedToken ? unauthorizedToken : token}`,
  };

  const options = {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(
      chatHistoryUrl ? chatHistoryUrl + url : baseUrl + url,
      options
    );
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

export const handleLogout = () => {
  localStorage.removeItem("user-visited-dashboard");
  localStorage.removeItem("unauthorized-token");
  window.location.href = "/login";
};