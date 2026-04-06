<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const menuItems = [
  {
    name: "總覽",
    path: "/dashboard",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  },
  {
    name: "成績列表",
    path: "/scoretable",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>`,
  },
  {
    name: "防作弊監控",
    path: "/anticheat",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
  {
    name: "系統日誌",
    path: "/logs",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  },
  {
    name: "考試設定",
    path: "/settings",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
];

const currentTitle = computed(() => {
  const item = menuItems.find((item) => item.path === route.path);
  return item ? item.name : "Dashboard";
});
</script>

<template>
  <div class="flex h-screen bg-gray-50 font-sans text-gray-900">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300"
    >
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
          >
            T
          </div>
          <span class="font-bold text-lg tracking-tight text-gray-900"
            >Exam TA</span
          >
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden"
          active-class="bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200/50"
          :class="{
            'text-gray-600 hover:bg-gray-100 hover:text-gray-900':
              $route.path !== item.path,
          }"
        >
          <span
            class="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
            :class="{ 'opacity-100 text-blue-600': $route.path === item.path }"
            v-html="item.icon"
          ></span>
          {{ item.name }}
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-200">
        <div
          class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-medium text-white shadow-sm ring-2 ring-white"
          >
            TA
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-medium text-gray-900 leading-none mb-1"
              >System Admin</span
            >
            <span class="text-[10px] text-gray-500 leading-none"
              >NTUT Exam System</span
            >
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
      <!-- Top Header -->
      <header
        class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10"
      >
        <h1 class="text-xl font-semibold text-gray-800 tracking-tight">
          {{ currentTitle }}
        </h1>
      </header>

      <!-- Scrollable Content Area -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-8 relative scroll-smooth">
        <div class="max-w-7xl mx-auto w-full h-full">
          <router-view v-slot="{ Component }">
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
              mode="out-in"
            >
              <component :is="Component" class="h-full" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* Global scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; /* slate-300 */
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8; /* slate-400 */
}
</style>
