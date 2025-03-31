import { createFileRoute } from "@tanstack/react-router";
// import React from "react";
import { useState } from "react";


export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

function SignInLink() {
  return (
    <div className="mt-3 text-center">
      <p className="text-gray-400">
        Back to{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

function MainScreen({ handleSubmit, email, setEmail }: { handleSubmit: () => void, email: string, setEmail: (newEmail: string) => void }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-white">
          Forgot Password
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Please enter your email address to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@mail.com"
            className="w-full rounded-lg border border-gray-700 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-900 py-3 text-center text-white hover:bg-indigo-800 transition-colors"
        >
          Send Email
        </button>
      </form>
      
      <SignInLink />
    </>
  )
}

function SentScreen() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-white">
          Check your email
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          We have sent a password recovery instruction to your email
        </p>
      </div>
      <button
        className="w-full rounded-lg bg-indigo-900 py-3 text-center text-white hover:bg-indigo-800 transition-colors"
      >
        Resend Email
      </button>
      
      <SignInLink />
    </>
  )
}

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("main");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested for:", email);
    setState("sent");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md px-6">
        {state == "main" && <MainScreen handleSubmit={handleSubmit} email={email} setEmail={setEmail}/>}
        {state == "sent" && <SentScreen />}
      </div>
    </div>
  );
}
