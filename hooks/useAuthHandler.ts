"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

interface LoginData {
  identifier: string;
  password: string;
}

export const useLoginHandler = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const handleLoginSubmit = async (data: LoginData) => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await login(data.identifier, data.password);
      router.push("/dashboard");
      return true;
    } catch (error: unknown) {
      let errorMessage = "Login failed. Please try again.";

      if (error instanceof AxiosError) {
        if (error.response && error.response.data) {
          errorMessage =
            typeof error.response.data === "string"
              ? error.response.data
              : error.response.data.message ||
                JSON.stringify(error.response.data);
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      setIsLoggingIn(false);
      return false;
    }
  };

  return {
    error,
    isLoggingIn,
    handleLoginSubmit,
  };
};
