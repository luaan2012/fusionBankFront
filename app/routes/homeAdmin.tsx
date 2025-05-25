import { Index } from "../homeAdmin/"
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fusion Bank" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return < Index />;
}
