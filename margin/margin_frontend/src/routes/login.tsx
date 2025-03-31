import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../ui/views/LoginForm";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <div className="flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
