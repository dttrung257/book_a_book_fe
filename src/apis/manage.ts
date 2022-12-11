import axiosInstance from "./axiosInstance";
import { UserSignUp } from "../models";

export const getUser = async (id: string, options: Object) => {
  const response = await axiosInstance.get(`/manage/users/${id}`, options);
  return response.data;
};

export const getUsersList = async (
  name: string,
  page: number | string = 0,
  options: Object
) => {
  const response = await axiosInstance.get(
    `/manage/users?name=${name}&page=${page}&size=15`,
    options
  );
  return response.data;
};

export const addUser = async (userAddInfo: UserSignUp, options: Object) => {
  const response = await axiosInstance.post(
    `/manage/users`,
    userAddInfo,
    options
  );
  return response.data;
};

export const deleteUser = async (id: string, options: Object) => {
  const response = await axiosInstance.delete(`/manage/users/${id}`, options);
  return response.data;
};

export const changeUserStatus = async (
  id: string,
  newStatus: { status: string; state: boolean },
  options: Object
) => {
  const response = await axiosInstance.put(
    `/manage/users/${id}/status`,
    newStatus,
    options
  );
  return response.data;
};

export const changeUserPassword = async (
  id: string,
  newPassword: string,
  options: Object
) => {
  const response = await axiosInstance.put(
    `/manage/users/${id}/password`,
    {
      newPassword: newPassword,
    },
    options
  );
  return response.data;
};

export const getUserOrders = async (
  id: string,
  page: number | string = 0,
  options: Object
) => {
  const response = await axiosInstance.get(
    `/manage/orders?user_id=${id}&page=${page}`,
    options
  );
  return response.data;
};
