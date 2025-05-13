import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../ui/dashboard/Dashboard";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});
