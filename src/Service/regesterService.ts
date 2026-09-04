import axios from "axios";
import type { InterfaceRegister } from "../Interface/interfaceRegister.ts";
import { BaseUrl } from "../Const/BaseUrl.ts";

export async function sendData(data: InterfaceRegister) {
  try {
    const response = await axios.post(`${BaseUrl}/users/signup`, data);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("HEADERS:", error.response?.headers);
    }

    throw error;
  }
}