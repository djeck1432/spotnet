
import { Outlet } from "@tanstack/react-router";

export default function DashboardLayout() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <a href="/dashboard">Home</a> |{" "}
        <a href="/dashboard/settings">Settings</a>
      </nav>
      <Outlet />
    </div>
  );
}
