export interface Article {
    id: number;
    title: string;
    authorId: number;
    date: string;
    category: string;
    summary: string;
    content: string;
    image: string;
    views: number;
  }

  // Neu hinzufügen:
export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  text: string;
  date: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
}