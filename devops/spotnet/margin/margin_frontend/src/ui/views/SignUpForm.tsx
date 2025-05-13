import { Button } from "../core/button";
import { Card } from "../core/card";
import { Input } from "../core/input";
import { useState } from "react";
import useCreateUser from "../hooks/useCreateUser";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpApiData = {
  name: string;
  email: string;
  password: string;
};

const PasswordVisibilityIcon = ({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) => (
  <svg
    onClick={onClick}
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
      className={isVisible ? "hidden" : ""}
      x1="2"
      x2="22"
      y1="2"
      y2="22"
    ></line>
    <path
      className={!isVisible ? "hidden" : ""}
      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7Z"
    ></path>
    <circle
      className={!isVisible ? "hidden" : ""}
      cx="12"
      cy="12"
      r="3"
    ></circle>
  </svg>
);

const SignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const mutation = useCreateUser();

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSignUp = () => {
    if (!validateForm()) return;

    const apiData: SignUpApiData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    mutation.mutate(apiData, {
      onSuccess: () => alert("User created successfully!"),
      onError: (error: any) => alert(error.message),
    });
  };

  const fields = [
    { name: "name", placeholder: "Enter your full name" },
    { name: "email", placeholder: "Enter your email address" },
    { name: "password", placeholder: "Create a password" },
    { name: "confirmPassword", placeholder: "Confirm your password" },
  ];

  return (
    <Card className="text-white flex gap-5 flex-col px-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p>And let's get started with your free trial</p>
      </div>

      {fields.map(({ name, placeholder }) => (
        <div key={name} className="flex flex-col">
          <label>
            {name === "confirmPassword"
              ? "Confirm Password"
              : name.charAt(0).toUpperCase() + name.slice(1)}
          </label>
          <div className="w-100 relative flex items-center justify-center">
            <Input
              className={`w-100 ${errors[name as keyof SignUpFormData] ? "border-red-500" : ""}`}
              type={
                name.toLowerCase().includes("password") &&
                !passwordVisibility[name as "password" | "confirmPassword"]
                  ? "password"
                  : "text"
              }
              name={name}
              placeholder={placeholder}
              onChange={handleChange}
              value={formData[name as keyof SignUpFormData]}
            />
            {name.toLowerCase().includes("password") && (
              <PasswordVisibilityIcon
                isVisible={
                  passwordVisibility[name as "password" | "confirmPassword"]
                }
                onClick={() =>
                  togglePasswordVisibility(
                    name as "password" | "confirmPassword",
                  )
                }
              />
            )}
          </div>
          {errors[name as keyof SignUpFormData] && (
            <span className="text-red-500 text-xs mt-1">
              {errors[name as keyof SignUpFormData]}
            </span>
          )}
        </div>
      ))}

      <Button variant="outline" onClick={onSignUp}>
        Sign Up
      </Button>
      <div className="flex justify-center gap-2 text-xs">
        <span>Already have an account?</span>
        <a href="/login" className="underline">
          Sign In
        </a>
      </div>
    </Card>
  );
};

export default SignUpForm;
