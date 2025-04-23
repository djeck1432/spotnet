import { createFileRoute } from "@tanstack/react-router";
import CryptoDashboard from "../../ui/CryptoDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="crypto-dashboard-container">
      <CryptoDashboard />
    </div>
  );
}
