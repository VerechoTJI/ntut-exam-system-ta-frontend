<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps<{
  codes: { codeList: string[]; codeOBJ: Record<string, string> } | null;
}>();

const currentFile = ref<string>("");

// Calculate current code content
const currentCodeContent = computed(() => {
  if (!props.codes?.codeOBJ || !currentFile.value) return "";
  return props.codes.codeOBJ[currentFile.value] || "";
});

// Calculate line count based on newlines
const lineCount = computed(() => {
  if (!currentCodeContent.value) return 0;
  return currentCodeContent.value.split("\n").length;
});

// Auto-select first file when codes change
watch(
  () => props.codes,
  (newCodes) => {
    if (newCodes?.codeList?.length > 0) {
      currentFile.value = newCodes.codeList[0] || "";
    } else {
      currentFile.value = "";
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div
    v-if="codes && codes.codeList.length > 0"
    class="flex flex-col h-full w-full bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 transition-colors"
  >
    <!-- File Tabs -->
    <div
      class="flex items-center gap-1 px-3 pt-2 bg-slate-800 border-b border-slate-700 overflow-x-auto shrink-0 scrollbar-hide"
    >
      <button
        v-for="fileName in codes.codeList"
        :key="fileName"
        @click="currentFile = fileName"
        :class="[
          'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 border-t border-x relative top-[1px] select-none',
          currentFile === fileName
            ? 'bg-slate-900 text-blue-400 border-slate-700 border-b-slate-900 z-10'
            : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-700/50',
        ]"
      >
        <span class="opacity-70">📄</span>
        {{ fileName }}
      </button>
    </div>

    <!-- Code Area -->
    <div
      class="flex-1 overflow-auto relative flex flex-row font-mono text-sm leading-6 bg-slate-900"
    >
      <!-- Line Numbers -->
      <div
        class="sticky left-0 min-w-[3rem] bg-slate-800/30 text-slate-500 text-right pr-3 py-4 select-none border-r border-slate-800 z-10 hidden sm:block h-full"
        aria-hidden="true"
      >
        <div v-for="n in lineCount" :key="n" class="leading-6">{{ n }}</div>
      </div>

      <!-- Code Content -->
      <div class="flex-1 pl-4 py-4 pr-4 overflow-visible">
        <highlightjs
          v-if="currentFile"
          language="python"
          :code="currentCodeContent"
        />
      </div>
    </div>
  </div>

  <div
    v-else
    class="flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 h-full"
  >
    <div class="bg-white p-4 rounded-full shadow-sm mb-4">
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
        class="text-slate-300"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    </div>
    <p class="font-medium text-slate-600">No code available</p>
    <p class="text-sm text-slate-400 mt-1">Select a submission to view code</p>
  </div>
</template>

<style scoped>
/* Custom scrollbar for tab area */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Ensure code font consistency */
:deep(code.hljs) {
  font-family:
    "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco,
    Consolas, monospace !important;
  background: transparent !important;
  padding: 0 !important;
  font-size: 0.875rem !important; /* 14px */
  line-height: 1.5rem !important; /* 24px matches 'leading-6' */
}

/* Override HighlightJS default background */
:deep(.hljs) {
  background: transparent !important;
}
</style>
