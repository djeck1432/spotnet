import { createFileRoute } from "@tanstack/react-router";
// import React from "react";
import { useState } from "react";


export const Route = createFileRoute("/reset_password")({
  component: ResetPassword,
});

function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested for:", email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="">
          <h1 className="text-4xl font-medium text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-400 mb-8">
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

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Back to{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
