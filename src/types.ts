export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  userId: number; 
  date: string;
  category: string;
  summary: string;
  content: string;
  image?: string; 
  views: number;
}


export interface ArticleWithUser extends Article {
  user: User;
}

export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  text: string;
  date: string;
}


export interface CommentWithUser extends Comment {
  user: User;
}