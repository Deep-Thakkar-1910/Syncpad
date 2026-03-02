import axios from "axios";
// For local development
export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL!,
});
