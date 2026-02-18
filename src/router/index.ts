import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import ExecuteCode from "../views/ExecuteCode.vue";
import StudentDashboard from "../views/StudentDashboard.vue";
import ScoreTable from "../views/ScoreTable.vue";
import Anticheat from "../views/Anticheat.vue";
import LogViewer from "../views/LogViewer.vue";
import StudentCodeViewer from "../views/StudentCodeViewer.vue";
import ExamGenerator from "../views/ExamGenerator.vue";
import SystemSettings from "../views/SystemSettings.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: SystemSettings,
  },
  {
    path: "/settings",
    name: "SystemSettings",
    component: SystemSettings,
  },
  // {
  //   path: "/execute",
  //   name: "ExecuteCode",
  //   component: ExecuteCode,
  // },
  {
    path: "/scoreboard",
    name: "ScoreBoard",
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
    path: "/logviewer",
    name: "LogViewer",
    component: LogViewer,
  },
  // {
  //   path: "/studentcodeviewer",
  //   name: "StudentCodeViewer",
  //   component: StudentCodeViewer,
  // },
  // {
  //   path: "/examgenerator",
  //   name: "ExamGenerator",
  //   component: ExamGenerator,
  // },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
