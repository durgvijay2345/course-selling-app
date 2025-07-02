export const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8001/api/v1"
    : "https://course-selling-app-r3sw.onrender.com/api/v1";
