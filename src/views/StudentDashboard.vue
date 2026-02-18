<template>
  <div
    class="p-6 max-w-7xl mx-auto min-h-screen flex flex-col font-sans text-gray-800"
  >
    <h1 class="text-3xl font-bold mb-8 text-gray-900">Student Dashboard</h1>

    <!-- Search Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">Search Student</h2>
      <div class="flex gap-4">
        <div class="relative flex-1">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            v-model="searchID"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Enter Student ID (e.g. 114590001)"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
          />
        </div>
        <button
          @click="handleSearch"
          :disabled="dashboardStore.isLoading"
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ dashboardStore.isLoading ? "Searching..." : "Search" }}
        </button>
      </div>

      <!-- Submitted Students Hint -->
      <div v-if="dashboardStore.submittedStudents.length > 0" class="mt-4">
        <p class="text-sm text-gray-500 mb-2">
          Students who have submitted code:
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="sid in dashboardStore.submittedStudents"
            :key="sid"
            @click="quickSearch(sid)"
            class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
          >
            {{ sid }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="dashboardStore.error"
      class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm"
    >
      <p class="font-bold">Error</p>
      <p>{{ dashboardStore.error }}</p>
    </div>

    <!-- Student Details -->
    <div
      v-if="hasSearched && !dashboardStore.error"
      class="flex-1 flex flex-col gap-8"
    >
      <!-- Header & Actions -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            <span v-if="dashboardStore.currentStudentScore?.student_name">{{
              dashboardStore.currentStudentScore.student_name
            }}</span>
            <span v-else>Student</span>
            <span class="text-gray-500 font-normal ml-2">({{ searchID }})</span>
          </h2>
          <div class="text-sm text-gray-500 mt-1 flex items-center gap-4">
            <span
              >Last Submit:
              {{
                formatTime(dashboardStore.currentStudentScore?.last_submit_time)
              }}</span
            >
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="handleJudge"
            :disabled="dashboardStore.isLoading"
            class="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
          >
            <svg
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Judge Code
          </button>
        </div>
      </div>

      <!-- Scoreboard for this student -->
      <div
        v-if="dashboardStore.currentStudentScore"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-gray-900">
            Current Score Status
          </h3>
          <div class="text-sm text-gray-500">
            Passed:
            <span class="font-bold text-green-600">{{
              dashboardStore.currentStudentScore.passed_subtask_amount
            }}</span>
            / {{ dashboardStore.currentStudentScore.subtask_amount }} Subtasks
          </div>
        </div>
        <div class="p-6 overflow-x-auto bg-gray-50/30">
          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="(subtasks, pid) in dashboardStore.currentStudentScore
                .puzzle_results"
              :key="pid"
              class="border rounded-lg bg-white shadow-sm overflow-hidden"
            >
              <div
                class="bg-gray-100 px-4 py-2 border-b font-bold text-gray-700"
              >
                Problem {{ Number(pid) + 1 }}
              </div>
              <div
                class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div
                  v-for="(sub, sIdx) in subtasks"
                  :key="sIdx"
                  class="text-sm border rounded bg-white relative group transition-all hover:shadow-md"
                >
                  <div
                    class="px-3 py-2 border-b bg-gray-50 flex justify-between items-center rounded-t"
                  >
                    <span class="font-medium text-gray-600"
                      >Subtask {{ sIdx + 1 }}</span
                    >
                    <span
                      class="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider"
                      :class="
                        isSubtaskPassed(sub)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{ isSubtaskPassed(sub) ? "PASS" : "FAIL" }}
                    </span>
                  </div>

                  <div class="p-3 space-y-3">
                    <!-- Visible -->
                    <div v-if="sub.visible && sub.visible.length">
                      <div
                        class="text-[10px] uppercase text-gray-400 font-bold mb-1.5 flex items-center"
                      >
                        Visible Cases
                        <span
                          class="ml-auto text-[9px] bg-gray-100 text-gray-500 px-1 rounded"
                          >{{ sub.visible.length }}</span
                        >
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        <div
                          v-for="(vc, vIdx) in sub.visible"
                          :key="`v-${vIdx}`"
                          class="h-6 min-w-[1.5rem] px-1 flex items-center justify-center rounded text-[10px] font-bold text-white cursor-pointer shadow-sm transition-transform hover:scale-105 active:scale-95"
                          :class="getStatusCodeBg(vc.status)"
                          :title="`Visible #${vIdx + 1}\nClick to view details`"
                          @click="showTestCaseDetail(vc)"
                        >
                          {{ vc.status }}
                        </div>
                      </div>
                    </div>

                    <!-- Hidden -->
                    <div v-if="sub.hidden && sub.hidden.length">
                      <div
                        class="text-[10px] uppercase text-gray-400 font-bold mb-1.5 mt-1 flex items-center"
                      >
                        Hidden Cases
                        <span
                          class="ml-auto text-[9px] bg-gray-100 text-gray-500 px-1 rounded"
                          >{{ sub.hidden.length }}</span
                        >
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        <div
                          v-for="(hc, hIdx) in sub.hidden"
                          :key="`h-${hIdx}`"
                          class="h-6 min-w-[1.5rem] px-1 flex items-center justify-center rounded text-[10px] font-bold text-white cursor-pointer shadow-sm transition-transform hover:scale-105 active:scale-95"
                          :class="getStatusCodeBg(hc.status)"
                          :title="`Hidden #${hIdx + 1}\nClick to view details`"
                          @click="showTestCaseDetail(hc)"
                        >
                          {{ hc.status }}
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="!sub.visible?.length && !sub.hidden?.length"
                      class="text-xs text-gray-400 italic text-center py-2"
                    >
                      No test cases
                    </div>
                  </div>
                </div>
              </div>
              <!-- If no subtasks -->
              <div
                v-if="!subtasks || subtasks.length === 0"
                class="p-4 text-center text-gray-400 italic text-sm"
              >
                No subtasks found for this problem.
              </div>
            </div>
          </div>
          <div
            v-if="
              Object.keys(dashboardStore.currentStudentScore.puzzle_results)
                .length === 0
            "
            class="text-center text-gray-500 py-8 bg-white border border-dashed rounded-lg mt-4"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">
              No score records found for this student.
            </p>
          </div>
        </div>
      </div>

      <!-- Code Viewer Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row h-[700px]"
      >
        <!-- File List Sidebar -->
        <div
          class="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col"
        >
          <div
            class="p-4 border-b border-gray-200 bg-gray-100 flex justify-between items-center"
          >
            <h3 class="font-bold text-gray-700 text-sm uppercase tracking-wide">
              Submitted Files
            </h3>
            <span
              class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium"
              v-if="dashboardStore.currentStudentCode?.codeList"
            >
              {{ dashboardStore.currentStudentCode.codeList.length }}
            </span>
          </div>

          <div
            v-if="
              !dashboardStore.currentStudentCode ||
              dashboardStore.currentStudentCode.codeList.length === 0
            "
            class="p-8 text-center text-sm text-gray-500 italic"
          >
            No code files found.
          </div>

          <ul v-else class="overflow-y-auto flex-1 custom-scrollbar">
            <li
              v-for="file in dashboardStore.currentStudentCode.codeList"
              :key="file"
            >
              <button
                @click="selectFile(file)"
                class="w-full text-left px-4 py-3 text-sm hover:bg-white hover:text-blue-600 focus:outline-none transition-all border-l-4 group"
                :class="
                  selectedFile === file
                    ? 'border-blue-500 bg-white shadow-sm'
                    : 'border-transparent hover:border-gray-300'
                "
              >
                <div
                  class="font-mono text-xs break-all"
                  :class="
                    selectedFile === file
                      ? 'text-blue-700 font-semibold'
                      : 'text-gray-600 group-hover:text-gray-900'
                  "
                >
                  {{ file }}
                </div>
                <div class="text-[10px] text-gray-400 mt-1 uppercase">
                  {{ detectLanguage(file) }}
                </div>
              </button>
            </li>
          </ul>
        </div>

        <!-- Code Content -->
        <div class="flex-1 flex flex-col bg-[#1e1e1e] relative">
          <div
            v-if="selectedFile"
            class="flex-1 overflow-hidden flex flex-col h-full"
          >
            <div
              class="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e3e] shrink-0"
            >
              <div class="flex items-center gap-2">
                <svg
                  class="h-4 w-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span class="text-gray-300 text-xs font-mono select-text">{{
                  selectedFile
                }}</span>
              </div>
              <span class="text-gray-500 text-xs uppercase font-mono">{{
                detectLanguage(selectedFile)
              }}</span>
            </div>
            <div class="flex-1 overflow-hidden relative">
              <!-- Native Prism or HighlightJS if available -->
              <pre
                class="h-full w-full absolute inset-0 m-0 overflow-auto p-4 text-sm font-mono text-gray-300"
              ><code>{{ codeContent }}</code></pre>
            </div>
          </div>
          <div
            v-else
            class="flex-1 flex items-center justify-center text-gray-500 bg-white h-full"
          >
            <div class="text-center p-8">
              <svg
                class="mx-auto h-16 w-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <h3 class="text-lg font-medium text-gray-900">Code Viewer</h3>
              <p class="mt-2 text-sm text-gray-500">
                Select a file from the sidebar to view the source code.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal for Test Case Details -->
      <div
        v-if="selectedTestCase"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]"
        >
          <div
            class="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg"
          >
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-3">
              Test Case Detail
              <span
                class="px-3 py-1 text-xs text-white rounded-full"
                :class="getStatusCodeBg(selectedTestCase.status)"
              >
                {{ selectedTestCase.status }}
              </span>
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto space-y-4">
            <!-- Time -->
            <div class="flex items-center text-sm text-gray-600">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Execution Time:
              <span class="font-mono font-medium ml-1 text-gray-900"
                >{{ selectedTestCase.time }} ms</span
              >
            </div>

            <!-- Expected Output -->
            <div>
              <h4
                class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Expected Output
              </h4>
              <div
                class="bg-gray-100 p-3 rounded-lg border border-gray-200 font-mono text-sm whitespace-pre-wrap break-all max-h-48 overflow-auto"
              >
                {{ selectedTestCase.expectedOutput || "(Empty or Hidden)" }}
              </div>
            </div>

            <!-- User Output -->
            <div>
              <h4
                class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                User Output
              </h4>
              <div
                class="bg-gray-900 text-gray-100 p-3 rounded-lg border border-gray-700 font-mono text-sm whitespace-pre-wrap break-all max-h-48 overflow-auto"
              >
                {{ selectedTestCase.userOutput || "(Empty)" }}
              </div>
            </div>
          </div>

          <div class="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end">
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useStudentDashboardStore } from "../stores/studentDashboardStore";
import CodeViewer from "../components/CodeViewer.vue";

const dashboardStore = useStudentDashboardStore();
const searchID = ref("");
const hasSearched = ref(false);
const selectedFile = ref<string | null>(null);
const selectedTestCase = ref<any>(null);

onMounted(() => {
  dashboardStore.fetchSubmittedStudents();
});

const closeModal = () => {
  selectedTestCase.value = null;
};

const showTestCaseDetail = (tc: any) => {
  selectedTestCase.value = tc;
};

const codeContent = computed(() => {
  if (!selectedFile.value || !dashboardStore.currentStudentCode?.codeOBJ)
    return "";
  return dashboardStore.currentStudentCode.codeOBJ[selectedFile.value] || "";
});

const quickSearch = (sid: string) => {
  searchID.value = sid;
  handleSearch();
};

const handleSearch = async () => {
  if (!searchID.value.trim()) return;
  hasSearched.value = true;
  selectedFile.value = null;
  dashboardStore.clearCurrentStudent();

  // Fetch both score and code in parallel for efficiency
  await Promise.all([
    dashboardStore.fetchStudentScore(searchID.value),
    dashboardStore.fetchStudentCode(searchID.value),
  ]);
};

const selectFile = (file: string) => {
  selectedFile.value = file;
};

// Initial auto-select file when code loads
watch(
  () => dashboardStore.currentStudentCode,
  (newVal) => {
    if (newVal && newVal.codeList.length > 0 && !selectedFile.value) {
      selectedFile.value = newVal.codeList[0];
    }
  },
);

const handleJudge = async () => {
  if (!searchID.value) return;
  await dashboardStore.judgeStudentCode(searchID.value);
};

// --- Utilities ---
const formatTime = (iso: string | null | undefined) => {
  if (!iso) return "Never";
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-TW", { hour12: false });
  } catch {
    return iso;
  }
};

const getStatusCodeBg = (status: string) => {
  switch (status) {
    case "AC":
      return "bg-green-500";
    case "WA":
      return "bg-red-500";
    case "TLE":
      return "bg-orange-500";
    case "MLE":
      return "bg-orange-500";
    case "RE":
      return "bg-purple-500";
    case "CE":
      return "bg-yellow-500";
    case "SE":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};

// The type for subtask is based on the API response structure you provided in prompt
const isSubtaskPassed = (sub: any) => {
  if (!sub) return false;
  // Check visible
  const visiblePass = sub.visible
    ? sub.visible.every((tc: any) => tc.status === "AC")
    : true;
  // Check hidden
  const hiddenPass = sub.hidden
    ? sub.hidden.every((tc: any) => tc.status === "AC")
    : true;

  return (
    visiblePass &&
    hiddenPass &&
    (sub.visible?.length || 0) + (sub.hidden?.length || 0) > 0
  );
};

const detectLanguage = (filename: string | null) => {
  if (!filename) return "text";
  const lower = filename.toLowerCase();
  if (lower.endsWith(".py")) return "python";
  if (
    lower.endsWith(".c") ||
    lower.endsWith(".cpp") ||
    lower.endsWith(".h") ||
    lower.endsWith(".hpp")
  )
    return "cpp";
  if (lower.endsWith(".js") || lower.endsWith(".ts")) return "javascript";
  if (lower.endsWith(".java")) return "java";
  if (lower.endsWith(".html")) return "html";
  if (lower.endsWith(".css")) return "css";
  if (lower.endsWith(".sh")) return "shell";
  return "text";
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark mode scrollbar for code viewer */
.bg-\[\#1e1e1e\] .custom-scrollbar::-webkit-scrollbar-track {
  background: #1e1e1e;
}
.bg-\[\#1e1e1e\] .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>
