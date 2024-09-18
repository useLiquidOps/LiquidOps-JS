import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.liquidops.io/",
  // baseURL: "http://localhost:3001/",
});
