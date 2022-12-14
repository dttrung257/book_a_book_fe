export interface Comment {
  id: string;
  userId: string;
  bookId: number;
  fullName: string;
  avatar: string;
  bookName: string;
  star: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentCore {
  bookId: number;
  star: number;
  content: string;
}

export interface CommentDetail {
  id: number;
  userId: number;
  bookId: number;
  fullName: string;
  avatar: string;
  bookName: string;
  star: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
