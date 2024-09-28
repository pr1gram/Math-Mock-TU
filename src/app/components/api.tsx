import { useEffect } from "react";
import axios from "axios";

require('dotenv').config();
export default async function apiFunction(method: string, url: string, body: any) {
  const options = {
    method: method,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.API_KEY },
    data: body,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}
