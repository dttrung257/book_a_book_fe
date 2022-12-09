import { access } from "fs";
import { OrderPost } from "../models";
import axiosInstance from "./axiosInstance";

export const getOrder = async (accessToken: string) => {
  const response = await axiosInstance.get("orders", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
export const deleteOrder = async (accessToken: string, id: string) => {
  const response = await axiosInstance.delete(`orders/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export const getOrderDetails = async (accessToken: string, id: string) => {
  const response = await axiosInstance.get(`orders/${id}/orderdetails`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const postOrder = async (accessToken: string, order: OrderPost) => {
  const response = await axiosInstance.post(`orders`, order, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
