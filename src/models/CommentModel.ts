export interface Comment {
  id: string;
  userId: string;
  bookId: number;
  fullName: string;
  avatar: string;
  bookName: string;
  star: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CommentCore {
  bookId: number;
  star: number;
  content: string;
}
