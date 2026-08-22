import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Termini from "../pages/Termini.vue";
import Dashboard from "../pages/Dashboard.vue";
import Onama from "../pages/Onama.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/termini", component: Termini },
  { path: "/dashboard", component: Dashboard },
  { path: "/o-nama", component: Onama}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
