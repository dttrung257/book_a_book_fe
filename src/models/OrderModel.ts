export interface OrderInfo {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  orderDate: string;
  address: string;
  quantity: number;
  phoneNumber: string;
  total: number;
  status: string;
}
export interface PersonalOrder {
  id: string;
  orderDate: Date;
  address: string;
  quantity: number;
  total?: number;
  status: string;
  phoneNumber: string;
}

export interface OrderPost {
  address: string;
  phoneNumber: string;
  orderdetails: {
    bookId: number;
    quantity: number;
  }[];
}

export interface Item {
  bookName: string;
  id: string;
  image: string;
  priceEach: number;
  quantityOrdered: number;
}
