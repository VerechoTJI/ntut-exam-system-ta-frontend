import { defineStore } from "pinia";
import axios from "axios";
import { BASE_URL } from "../utilities/api";

export interface SystemLog {
  id: number;
  timestamp: string;
  student_ID: string;
  ip_address: string;
  mac_address: string;
  action_type: string;
  details: string;
}

interface SystemLogState {
  logs: SystemLog[];
  isLoading: boolean;
  error: string | null;
}

export const useSystemLogStore = defineStore("systemLog", {
  state: (): SystemLogState => ({
    logs: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchAllLogs() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(`${BASE_URL}/logs/all`);
        // The user specified the return value is directly the array (or in data)
        // Axios response.data contains the body.
        this.logs = response.data;
      } catch (err: any) {
        console.error("Failed to fetch system logs:", err);
        this.error = err.message || "Failed to fetch logs";
        this.logs = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
});
