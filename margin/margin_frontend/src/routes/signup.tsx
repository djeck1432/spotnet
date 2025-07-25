import { createFileRoute } from "@tanstack/react-router";
import EmailSignUpForm from "../ui/views/EmailSignUpForm";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <EmailSignUpForm />
    </div>
  );
}
