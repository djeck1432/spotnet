import { useMutation } from "@tanstack/react-query";

interface UserData {
  name: string;
  email: string;
  password: string;
}

const createUser = async (userData: UserData) => {
  const response = await fetch("http://localhost:8000/api/admin/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create user");
  }

  return response.json();
};

const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
    onError: (error: Error) => {
      console.error("User creation error:", error.message);
    },
  });
};

export default useCreateUser;
