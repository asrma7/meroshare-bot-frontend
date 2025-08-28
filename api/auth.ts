import axiosClient from "./axiosClient";

export const login = async (identifier: string, password: string) => {
  const response = await axiosClient.post(`/login`, {
    identifier,
    password,
  });
  return response.data;
};

export const register = async (
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  password: string
) => {
  const response = await axiosClient.post(`/register`, {
    first_name,
    last_name,
    username,
    email,
    password,
  });
  return response.data;
};
