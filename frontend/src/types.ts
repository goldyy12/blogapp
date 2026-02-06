// src/types/index.ts

export interface User {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
  username: string;
  email: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
  user: User;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  user: User;
  comments: Comment[];
}
