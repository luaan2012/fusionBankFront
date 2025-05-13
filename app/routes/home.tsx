import { Index } from "~/homePage"
import type { Route } from "./+types/home";

import "../../app.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fusion Bank" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Index />;
}
