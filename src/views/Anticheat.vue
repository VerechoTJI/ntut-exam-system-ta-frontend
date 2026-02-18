<template>
  <div class="page">
    <section class="panel">
      <header class="panel-header">
        <h3>警告系統</h3>
        <div class="actions">
          <label class="switch">
            <input type="checkbox" v-model="realtimeOn" />
            <span>即時更新</span>
          </label>
          <button :disabled="loadingAlerts" @click="refreshAlerts">
            {{ loadingAlerts ? "刷新中..." : "手動刷新" }}
          </button>
        </div>
      </header>

      <div v-if="alertError" class="error">{{ alertError }}</div>
      <div v-if="loadingAlerts" class="hint">載入中...</div>
      <div
        v-if="!loadingAlerts && alerts.length === 0 && !alertError"
        class="hint"
      >
        尚無警告
      </div>

      <div class="table-wrapper" v-if="!loadingAlerts && alerts.length > 0">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>學生</th>
              <th>類型</th>
              <th>時間</th>
              <th>IP</th>
              <th>Mac</th>
              <th>訊息</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in alerts" :key="a.id">
              <td>{{ a.id }}</td>
              <td>{{ a.student_id }}</td>
              <td>{{ a.type }}</td>
              <td>{{ formatTime(a.time) }}</td>
              <td>{{ a.ipAddress }}</td>
              <td>{{ a.mac || "—" }}</td>
              <td class="pre">{{ a.messeage || a.message }}</td>
              <td>
                <label class="switch">
                  <input
                    type="checkbox"
                    :checked="a.isOk"
                    @change="onToggleOk(a)"
                  />
                  <span>{{ a.isOk ? "OK" : "Not OK" }}</span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

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

onMounted(async () => {
  await refreshAlerts();
  store.setupSocket();
});

onBeforeUnmount(() => {
  store.teardownSocket();
});
</script>

<style scoped>
.page {
  padding: 16px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
}
.panel {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
button {
  padding: 6px 10px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.switch {
  display: flex;
  gap: 6px;
  align-items: center;
  user-select: none;
}
.error {
  color: #d93025;
  margin-bottom: 8px;
}
.hint {
  color: #555;
  margin: 8px 0;
}
.table-wrapper {
  overflow: auto;
  border: 1px solid #eee;
  border-radius: 6px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
th,
td {
  border: 1px solid #e6e6e6;
  padding: 6px 8px;
  text-align: left;
  white-space: nowrap;
}
th {
  background: #f7f7f7;
}
.pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
