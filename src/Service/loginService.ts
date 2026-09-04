import axios from "axios";

import { BaseUrl } from "../Const/BaseUrl.ts";
import type { InterfaceLogin } from "../Interface/interfaceRegister.ts";

export async function sendDataLogin(data: InterfaceLogin) {
  try {
    const response = await axios.post(`${BaseUrl}/users/signin`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("HEADERS:", error.response?.headers);
    }

    throw error;
  }
}
