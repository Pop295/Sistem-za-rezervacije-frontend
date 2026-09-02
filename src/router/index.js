import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Termini from "../pages/Termini.vue";
import Dashboard from "../pages/Dashboard.vue";
import Onama from "../pages/Onama.vue";
import Qna from "../pages/Qna.vue";
import Admin from "../pages/Admin.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/termini", component: Termini },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/o-nama", component: Onama },
  { path: "/pitanja", component: Qna },
  { path: "/admin", component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // Ulogovan je, ali nije admin - vracamo ga na pocetnu, ne na login
    return { path: "/" };
  }
});

export default router;