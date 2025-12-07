export type User = {
  id: string;
  name: string; 
  role?: UserRole | null;
  listeningPts: number;
  ventingPts: number;
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

export type LeaderboardUser = {
  id: string;
  anonId: string;
  points: number;
}