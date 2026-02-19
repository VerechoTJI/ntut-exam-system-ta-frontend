<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from "vue";
import { useAnticheatStore, type AnticheatLog } from "../stores/anticheatStore";

const store = useAnticheatStore();

// Use store state
const alerts = computed(() => store.logs);
const loadingAlerts = computed(() => store.isLoading);
const alertError = computed(() => store.error);
const realtimeOn = computed({
  get: () => store.realtimeOn,
  set: (val: boolean) => store.toggleRealtime(val),
});

const formatTime = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const refreshAlerts = async () => {
  await store.fetchAllLogs();
};

const onToggleOk = async (alert: AnticheatLog) => {
  const target = !alert.isOk;
  try {
    await store.updateLogStatus(alert.id, target);
  } catch (e) {
    console.error(e);
  }
};

/* Using standard Tailwind switch logic within the template */

onMounted(async () => {
  await refreshAlerts();
  store.setupSocket();
});

onBeforeUnmount(() => {
  store.teardownSocket();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-amber-500"
          >
            <path
              d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
            />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
          Alert System
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          Monitor suspicious activities in real-time
        </p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Realtime Switch -->
        <label class="flex items-center cursor-pointer select-none group">
          <div class="relative">
            <input type="checkbox" v-model="realtimeOn" class="sr-only" />
            <div
              class="block w-10 h-6 rounded-full transition-colors"
              :class="realtimeOn ? 'bg-green-500' : 'bg-gray-300'"
            ></div>
            <div
              class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"
              :class="realtimeOn ? 'transform translate-x-4' : ''"
            ></div>
          </div>
          <span
            class="ml-3 text-sm font-medium transition-colors"
            :class="realtimeOn ? 'text-green-600' : 'text-gray-500'"
            >Realtime Update</span
          >
        </label>

        <button
          @click="refreshAlerts"
          :disabled="loadingAlerts"
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="{ 'animate-spin': loadingAlerts }"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          {{ loadingAlerts ? "Loading..." : "Refresh" }}
        </button>
      </div>
    </div>

    <!-- Status Messages -->
    <div
      v-if="alertError"
      class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-center gap-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-red-500"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
      <span class="text-sm font-medium text-red-700">{{ alertError }}</span>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loadingAlerts && alerts.length === 0 && !alertError"
      class="bg-white rounded-xl border-dashed border-2 border-gray-200 p-12 flex flex-col items-center justify-center text-center"
    >
      <div
        class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-green-500"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-gray-900">All Clear</h4>
      <p class="text-gray-500 mt-1">No suspicious activities detected yet.</p>
    </div>

    <!-- Table -->
    <div
      v-if="alerts.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50/50 text-gray-500 border-b border-gray-100">
            <tr>
              <th class="px-6 py-3 font-medium">ID</th>
              <th class="px-6 py-3 font-medium">Student</th>
              <th class="px-6 py-3 font-medium">Type</th>
              <th class="px-6 py-3 font-medium">Time</th>
              <th class="px-6 py-3 font-medium">Network</th>
              <th class="px-6 py-3 font-medium w-1/3">Message</th>
              <th class="px-6 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="a in alerts"
              :key="a.id"
              class="hover:bg-gray-50/50 transition-colors group"
            >
              <td class="px-6 py-4 font-mono text-xs text-gray-400">
                #{{ a.id }}
              </td>
              <td class="px-6 py-4 font-medium text-gray-900">
                {{ a.student_id }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                >
                  {{ a.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500 whitespace-nowrap">
                {{ formatTime(a.time) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col text-xs">
                  <span class="font-mono text-gray-600">{{ a.ipAddress }}</span>
                  <span class="font-mono text-gray-400" v-if="a.mac">{{
                    a.mac
                  }}</span>
                </div>
              </td>
              <td
                class="px-6 py-4 text-gray-600 font-mono text-xs break-all max-w-xs"
              >
                {{ a.messeage || a.message }}
              </td>
              <td class="px-6 py-4 text-center">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="a.isOk"
                    @change="onToggleOk(a)"
                    class="sr-only peer"
                  />
                  <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
                  ></div>
                  <span
                    class="ml-2 text-xs font-medium"
                    :class="a.isOk ? 'text-green-600' : 'text-red-500'"
                    >{{ a.isOk ? "OK" : "Pending" }}</span
                  >
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
