import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";


import { Input } from "../core/input";
import { Card } from "../core/card";
import { Button } from "../core/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearError } from "../../store/slices/authSlice";

const textData = {
  h1: "Welcome back!",
  hint: "Please enter your credentials to sign in!",
  email: "Email",
  emailPlaceholder: "Enter your email",
  password: "Password",
  passwordPlaceholder: "Enter your password",
  login: "Sign In",
  rememberMe: "Remember Me",
  forgotPassword: "Forgot Password?",
  signUp: "Sign Up",
  signUpHint: "Don’t have an account yet?",
};

type LoginFormSchema = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginForm = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = () => {
    if (error) {
      dispatch(clearError());
    }
  };

  const onSendForm = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }

    const credentials: LoginFormSchema = {
      email: email.trim(),
      password,
      rememberMe,
    };

    dispatch(loginUser(credentials));
  };

  return (
    <Card className="text-white flex gap-6 flex-col font-bricolageGrotesque">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-center">{textData.h1}</h1>
        <p className="text-center">{textData.hint}</p>
      </div>
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded">
          {error}
        </div>
      )}
      <div className="flex flex-col">
        <label>{textData.email}</label>
        <Input
          className="w-100"
          type="email"
          placeholder={textData.emailPlaceholder}
          onChange={(e) => {
            setEmail(e.target.value);
            handleInputChange();
          }}
          value={email}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col">
        <label>{textData.password}</label>
        <div className="w-100 relative flex items-center  justify-center">
          <Input
            className="w-100 pr-10"
            type={passwordVisibility ? "text" : "password"}
            placeholder={textData.passwordPlaceholder}
            onChange={(e) => {
              setPassword(e.target.value);
              handleInputChange();
            }}
            value={password}
            disabled={loading}
          />
          <svg
            onClick={() => setPasswordVisibility(!passwordVisibility)}
            className="shrink-0 size-3.5 absolute right-4 cursor-pointer"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className="hs-password-active:hidden"
              d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
            ></path>
            <path
              className="hs-password-active:hidden"
              d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
            ></path>
            <path
              className="hs-password-active:hidden"
              d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
            ></path>
            <line
              className={passwordVisibility ? "hidden" : ""}
              x1="2"
              x2="22"
              y1="2"
              y2="22"
            ></line>
            <path
              className={!passwordVisibility ? "hidden" : ""}
              d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
            ></path>
            <circle
              className={!passwordVisibility ? "hidden" : ""}
              cx="12"
              cy="12"
              r="3"
            ></circle>
          </svg>
        </div>
      </div>
      <div className="flex justify-end">
        <a href="/change-password" className="text-xs underline">
          {textData.forgotPassword}
        </a>
      </div>
      <Button
        variant={"outline"}
        onClick={onSendForm}
        disabled={loading || !email.trim() || !password.trim()}
      >
        {loading ? "Signing In..." : textData.login}
      </Button>
      <div className="flex justify-center gap-2 text-xs">
        <p>{textData.signUpHint}</p>
        <a href="#" className="underline">
          {textData.signUp}
        </a>
      </div>
    </Card>
  );
};

export default LoginForm;
