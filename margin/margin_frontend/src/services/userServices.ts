import { useMutation } from "@tanstack/react-query";

const API_URL = "http://localhost:8000/api/admin/add";

const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
  });
};
