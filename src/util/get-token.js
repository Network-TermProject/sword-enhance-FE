export function getAccessToken() {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("Access token not found");
      }
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error.message);
      return null;
    }
  }
  