import { defineStore } from "pinia";
import axios from "axios";
import { BASE_URL } from "../utilities/api";

export const useMessageStore = defineStore("message", {
  actions: {
    async sendMessage(type: string, messege: string) {
      console.log("Sending message:", { type, messege });
      try {
        const response = await axios.post(`${BASE_URL}/message`, {
          type,
          message: messege,
        });
        return response.status === 200;
      } catch (error) {
        console.error("Failed to send message:", error);
        return false;
      }
    },
    async getMessegeList() {
      try {
        const response = await axios.get(`${BASE_URL}/message`);
        if (response.status === 200) {
          return response.data;
        } else {
          console.error("Failed to get message list:", response.statusText);
          return [];
        }
      } catch (error) {
        console.error("Failed to get message list:", error);
        return [];
      }
    },
  },
});
