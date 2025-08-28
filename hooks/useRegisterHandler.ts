"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

interface RegisterData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export const useRegisterHandler = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const handleRegisterSubmit = async (data: RegisterData) => {
    setError(null);
    setIsRegistering(true);
    try {
      await register(
        data.first_name,
        data.last_name,
        data.username,
        data.email,
        data.password
      );
      router.push("/dashboard");
      return true;
    } catch (error: unknown) {
      let errorMessage = "Registration failed. Please try again.";

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
      setIsRegistering(false);
      return false;
    }
  };

  return {
    error,
    isRegistering,
    handleRegisterSubmit,
  };
};
