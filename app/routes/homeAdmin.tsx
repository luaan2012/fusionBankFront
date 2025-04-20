import { HomeApp } from "../homeAdmin/HomeApp"
import type { Route } from "./+types/home";

import "../homeAdmin/homeAdmin.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fusion Bank" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return < HomeApp />;
}
