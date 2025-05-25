import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/homePage.tsx"), // Rota raiz (/)
  route("app", "routes/homeApp.tsx"), 
  route("admin", "routes/homeAdmin.tsx"), 
] satisfies RouteConfig;