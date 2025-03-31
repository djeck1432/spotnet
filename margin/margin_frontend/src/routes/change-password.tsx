import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordForm from "../ui/views/ResetPasswordForm";

export const Route = createFileRoute("/change-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <ResetPasswordForm />
    </div>
  );
}
