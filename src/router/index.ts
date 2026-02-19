import { createWebHashHistory, createRouter } from "vue-router";
import StudentDashboard from "../views/StudentDashboard.vue";
import ScoreTable from "../views/ScoreTable.vue";
import Anticheat from "../views/Anticheat.vue";
import LogViewer from "../views/LogViewer.vue";
import SystemSettings from "../views/SystemSettings.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: StudentDashboard,
  },
  {
    path: "/scoretable",
    name: "ScoreTable",
    component: ScoreTable,
  },
  {
    path: "/anticheat",
    name: "Anticheat",
    component: Anticheat,
  },
  {
    path: "/logs",
    name: "Logs",
    component: LogViewer,
  },
  {
    path: "/settings",
    name: "Settings",
    component: SystemSettings,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
