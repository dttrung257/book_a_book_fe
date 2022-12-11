import axiosInstance from "./axiosInstance";
import { changePass, UserDetail, UserSignUp, VerifyEmail } from "../models";

export const verifyEmail = async (verify: VerifyEmail) => {
  const res = await axiosInstance.get(
    `/users/forgot_password/${verify.email}/confirm_verification/${verify.verifyCode}`
  );
  return res.data;
};

export const resetUserPassword = async (
  email: string,
  resetToken: string,
  newPassword: string
) => {
  const res = await axiosInstance.put(`/users/forgot_password/reset_password`, {
    email,
    resetToken,
    newPassword,
  });
  return res.data;
};

export const forgetPassword = async (email: string) => {
  const res = await axiosInstance.get(`/users/forgot_password/${email}`);
  return res.data;
};

export const confirmVerifyCode = async (email: string, verifyCode: string) => {
  const res = await axiosInstance.get(
    `/authen/${email}/confirm_verification/${verifyCode}`
  );
  return res.data;
};

export const sendCodeEmail = async (email: string) => {
  const res = await axiosInstance.get(`/authen/send_email/${email}`);
  return res.data;
};

export const signUp = async (info: UserSignUp) => {
  const response = await axiosInstance.post("/authen/register", info);
  return response.data;
};

export const getUserInfo = async (o: Object) => {
  const response = await axiosInstance.get("/users", o);
  return response.data;
};

export const updateUserInfo = async (user: UserDetail, o: Object) => {
  const response = await axiosInstance.put("/users", user, o);
  return response.data;
};

export const changeUserPassword = async (changePass: changePass, o: Object) => {
  const response = await axiosInstance.put(
    "/users/change_password",
    changePass,
    o
  );
  return response;
};
