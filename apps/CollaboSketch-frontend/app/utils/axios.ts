const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import axios from "axios";

const instance = axios.create({
  baseURL: BASE_URL,
});

export default instance;
