export const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8001/api/v1"
    : "https://course-selling-app-ktj0.onrender.com/api/v1";
