import { useState } from "react";
import { Input } from "../core/input";
import { Card } from "../core/card";
import { Button } from "../core/button";

const ResetPasswordForm = () => {
  const [resetDone, setResetDone] = useState(false);
  const [passwordVisibleNew, setPasswordNewVisibility] = useState(false);
  const [passwordVisibleConfirm, setPasswordConfirmVisibility] =
    useState(false);
  const [newInput, setNewInput] = useState("");
  const [confirmInput, setConfirmInput] = useState("");

  const onSubmit = async () => {
    console.log("onSubmit");
    setResetDone(true);
  };

  const getHeader = (title: string, caption: string) => {
    return (
      <header>
        <h1 className="font-bold text-xl">{title}</h1>
        <div className="text-gray-400 text-sm">{caption}</div>
      </header>
    );
  };

  const passwordInput = (
    label: string,
    onChange: (value: string) => void,
    passwordVisible: boolean,
    setPasswordVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    return (
      <div className="flex flex-col">
        <label>{label}</label>
        <div className="w-100 relative flex items-center  justify-center">
          <Input
            className="w-100 pr-10"
            type={passwordVisible ? "text" : "password"}
            onChange={(e) => onChange(e.target.value)}
          />
          <svg
            onClick={() => setPasswordVisibility(!passwordVisible)}
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
              className={passwordVisible ? "hidden" : ""}
              x1="2"
              x2="22"
              y1="2"
              y2="22"
            ></line>
            <path
              className={!passwordVisible ? "hidden" : ""}
              d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
            ></path>
            <circle
              className={!passwordVisible ? "hidden" : ""}
              cx="12"
              cy="12"
              r="3"
            ></circle>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <Card className="text-white flex gap-6 flex-col">
      {!resetDone ? (
        <>
          {getHeader(
            "Set new Password",
            "Fill in your new password and confirm it",
          )}

          <form
            action=""
            className="flex gap-4 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {passwordInput(
              "Password",
              setNewInput,
              passwordVisibleNew,
              setPasswordNewVisibility,
            )}
            {passwordInput(
              "Confirm password",
              setConfirmInput,
              passwordVisibleConfirm,
              setPasswordConfirmVisibility,
            )}

            <div className="text-red-400 h-4">
              {newInput !== confirmInput &&
                confirmInput.length > 0 &&
                "Your passwords do not match"}
            </div>

            <Button
              variant={"outline"}
              size={"md"}
              type="submit"
              disabled={newInput !== confirmInput || !newInput.length}
              className="mt-1"
            >
              Submit
            </Button>
          </form>
        </>
      ) : (
        <>
          {getHeader("Reset done", "Your password has been successfully reset")}

          <Button variant={"outline"} size={"md"} className="mt-1">
            Continue
          </Button>
        </>
      )}

      <div className="text-center text-sm flex gap-1 justify-center">
        <span>Back to</span>
        <a className="text-indigo-600 hover:underline" href="/sign-in">
          Sign in
        </a>
      </div>
    </Card>
  );
};

export default ResetPasswordForm;
