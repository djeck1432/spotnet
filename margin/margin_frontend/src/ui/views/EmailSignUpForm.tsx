import { useState } from "react";
import { Input } from "../core/input";
import { Card } from "../core/card";
import { Button } from "../core/button";

const textData = {
  h1: "Create an account",
  hint: "Please enter your email to sign up!",
  email: "Email",
  emailPlaceholder: "Enter your email",
  signup: "Sign Up",
  login: "Log In",
  loginHint: "Already have an account?",
  successTitle: "Check your email",
  successMessage:
    "We've sent a confirmation link. Please check your inbox to complete registration.",
};

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onSignup = async () => {
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://0.0.0.0:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Something went wrong.");
        return;
      }

      setSuccess(true);
    } catch (e) {
      setError("Network error. Please try again later.");
    }
  };

  if (success) {
    return (
      <Card className="text-white flex gap-4 flex-col font-bricolageGrotesque text-center">
        <h1 className="text-2xl font-bold">{textData.successTitle}</h1>
        <p>{textData.successMessage}</p>
      </Card>
    );
  }

  return (
    <Card className="text-white flex gap-6 flex-col font-bricolageGrotesque">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-center">{textData.h1}</h1>
        <p className="text-center">{textData.hint}</p>
      </div>
      <div className="flex flex-col">
        <label>{textData.email}</label>
        <Input
          className="w-100"
          type="email"
          placeholder={textData.emailPlaceholder}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {error && <span className="text-red-500 text-sm mt-2">{error}</span>}
      </div>
      <Button variant="outline" onClick={onSignup}>
        {textData.signup}
      </Button>
      <div className="flex justify-center gap-2 text-xs">
        <p>{textData.loginHint}</p>
        <a href="/login" className="underline">
          {textData.login}
        </a>
      </div>
    </Card>
  );
};

export default SignupForm;
