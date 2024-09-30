import { useEffect } from "react";
import axios from "axios";

require('dotenv').config();
export default async function apiFunction(method: string, url: string, body: any) {
  const options = {
    method: method,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
    headers: { 'Content-Type': 'application/json', 'x-api-key': '34d8e22434adc1e1f826aa74a16c426371ebae91f085ce2437831756c1d1d43f' },
    //headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.NEXT_PUBLIC_API_KEY },
    data: body,
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (error: any) {
    return error;
  }
}
