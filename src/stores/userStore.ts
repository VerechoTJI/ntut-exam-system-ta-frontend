import { defineStore } from "pinia";
import axios from "axios";
import { BASE_URL } from "../utilities/api";

export const useUserStore = defineStore("user", {
    actions: {
        async destroyCrypto(studentID: string): Promise<boolean> {
            try {
                const response = await axios.delete(`${BASE_URL}/user/crypto`, {
                    params: { studentID },
                });
                return response.data.success; // boolean
            } catch (error) {
                console.error("Failed to destroy crypto:", error);
                return false;
            }
        },
        async getDeviceInfo(studentID: string): Promise<{ ip: string; mac: string } | null> {
            try {
                const response = await axios.get(`${BASE_URL}/user/devices`, {
                    params: { studentID },
                });
                return {
                    ip: response.data.data.ipAddress || "Unknown IP", // string
                    mac: response.data.data.macAddress || "Unknown MAC", // string
                };
            }
            catch (error) {
                console.error("Failed to get device info:", error);
                return null;
            }
        },
        async isUserCryptoExisting(studentID: string): Promise<boolean> {
            try {
                const response = await axios.get(`${BASE_URL}/user/crypto/exist`, {
                    params: { studentID },
                });
                return response.data.exists; // boolean
            } catch (error) {
                console.error("Failed to check crypto existence:", error);
                return false;
            }
        },
    },
});