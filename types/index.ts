export type User = {
  id: string;
  name: string; // anon_id
  role: UserRole | null;
};

export type UserRole = 'venter' | 'listener';

export type Post = {
  id: string;
  author_id: string;
  author_name: string;
  content: string;
  likesCount: number;
  isLikedByMe: boolean;
  created_at: string;
  distance?: number;
}