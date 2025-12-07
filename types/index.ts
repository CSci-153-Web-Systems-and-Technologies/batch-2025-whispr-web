export type User = {
  id: string;
  name: string; // anon_id
  role: UserRole | null;
};

export type UserRole = 'venter' | 'listener';