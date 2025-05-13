import { createFileRoute } from "@tanstack/react-router";
import SignUpForm from "../ui/views/SignUpForm";
export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <SignUpForm />
    </div>
  );
}
