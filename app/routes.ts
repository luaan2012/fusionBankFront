import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // Rota raiz (/)
  route("app", "routes/homeApp.tsx"), // Nova rota (/about)
  route("admin", "routes/homeAdmin.tsx"), // Nova rota (/about)
] satisfies RouteConfig;