import { useEffect } from "react";
import axios from "axios";

export default async function apiFunction(method: string, url: string, body: any) {
  const options = {
    method: method,
    url: `${process.env.BASE_URL}${url}`,
    headers: { "Content-Type": "application/json" },
    data: body,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error(error.status);
    return error.status;
  }
}