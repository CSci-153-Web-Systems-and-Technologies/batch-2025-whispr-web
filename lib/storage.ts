export interface WhisprCredential {
  anonymousId: string;
  password: string;
  createdAt: string;
}

const STORAGE_KEY = "whispr_credentials"

export function saveCredentials(credential: WhisprCredential) {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(STORAGE_KEY);
  const credentials: WhisprCredential[] = existing
    ? JSON.parse(existing)
    : [];

  credentials.push(credential);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  console.log('Credentials have been saved to localStorage')
}

export function getCredentials(): WhisprCredential[] {
  if (typeof window === "undefined") return [];

  const existing = localStorage.getItem(STORAGE_KEY);
  return existing ? JSON.parse(existing) : [];
}