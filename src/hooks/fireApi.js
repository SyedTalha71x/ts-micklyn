// server ip 
export const baseUrl = "http://64.23.166.88:8016";

// local ip of daniyal backend
// export const baseUrl = "http://192.168.18.52:8001";

// local ip of waqar backend
// export const chatBaseUrl = "http://192.168.18.52:5019";

// server ip of Python backend 
export const chatBaseUrl = "http://64.23.166.88:2024";


export const FireApi = async (url, method, data = null) => {
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
    const response = await fetch(baseUrl + url, options);
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

