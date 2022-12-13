import axiosInstance from "./axiosInstance";
import { UserSignUp } from "../models";
import {
  FilterBookDashboard,
  FilterCommentDashboard,
  FilterOrderDashboard,
} from "../models/Filter";
import { BookAddInfo } from "../models";

// User
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

// Book
export const getBooksList = async (
  filter: FilterBookDashboard,
  page: number | string = 0,
  options?: Object
) => {
  const response = await axiosInstance.get(
    `/books/?page=${page}&name=${filter.name}&category=${filter.category}&from=${filter.priceFrom}&to=${filter.priceTo}&rating=${filter.rating}`,
    options
  );
  return response.data;
};

export const addBook = async (bookAddInfo: BookAddInfo, options: Object) => {
  const response = await axiosInstance.post(
    `/manage/books`,
    bookAddInfo,
    options
  );
  return response.data;
};

export const getBook = async (id: string, options?: Object) => {
  const response = await axiosInstance.get(`/books/${id}`, options);
  return response.data;
};

export const changeBookStatus = async (
  id: string | number,
  stopSelling: boolean,
  options: Object
) => {
  const response = await axiosInstance.put(
    `/manage/books/${id}/status`,
    {
      stopSelling: stopSelling,
    },
    options
  );
  return response.data;
};

export const changeBookInfo = async (
  id: string | number,
  bookEditInfo: BookAddInfo,
  options: Object
) => {
  const response = await axiosInstance.put(
    `/manage/books/${id}`,
    bookEditInfo,
    options
  );
  return response.data;
};

export const deleteBook = async (id: number, options: Object) => {
  const response = await axiosInstance.delete(`/manage/books/${id}`, options);
  return response.data;
};

// Comment
export const getCommentsList = async (
  filter: FilterCommentDashboard,
  page: number | string = 0,
  options: Object
) => {
  const response = await axiosInstance.get(
    `/manage/comments?page=${page}&book_id=${filter.bookID}&book_name=${filter.bookName}&date=${filter.date}&fullname=${filter.userName}`,
    options
  );
  return response.data;
};

export const deleteComment = async (id: number, options: Object) => {
  const response = await axiosInstance.delete(
    `/manage/comments/${id}`,
    options
  );
  return response.data;
};

// Order
export const getOrdersList = async (
  filter: FilterOrderDashboard,
  page: number | string = 0,
  options: Object
) => {
  const response = await axiosInstance.get(
    `/manage/orders/?page=${page}&size=15&name=${filter.name}&from=${filter.priceFrom}&to=${filter.priceTo}&date=${filter.date}&status=${filter.status}`,
    options
  );
  return response.data;
};

export const addOrder = async (
  orderAddInfo: { bookId: number; quantity: number }[],
  options: Object
) => {
  const response = await axiosInstance.post(
    `/manage/orders`,
    { orderdetails: orderAddInfo },
    options
  );
  return response.data;
};

export const getOrder = async (id: string, options: Object) => {
  const response = await axiosInstance.get(`/manage/orders/${id}`, options);
  return response.data;
};

export const getOrderDetail = async (id: string, options: Object) => {
  const response = await axiosInstance.get(
    `/orders/${id}/orderdetails`,
    options
  );
  return response.data;
};

export const changeOrderStatus = async (
  id: string | number,
  status: string,
  options: Object
) => {
  const response = await axiosInstance.put(
    `/manage/orders/${id}`,
    {
      status,
    },
    options
  );
  return response.data;
};

export const deleteOrder = async (id: string, options: Object) => {
  const response = await axiosInstance.delete(`/manage/orders/${id}`, options);
  return response.data;
};
