import adjectivesData from '@/data/adjectives.json';
import beingsData from '@/data/beings.json';

export function generateAnonId():string  {
  const adjectives: string[] = adjectivesData.adjectives;
  const beings: string[] = beingsData.beings;
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomBeing = beings[Math.floor(Math.random() * beings.length)];
  const randomNumber = Math.floor(Math.random() * 100).toString().padStart(2, "0"); 

  return `${randomAdjective}${randomBeing}${randomNumber}`;
}

export function generatePassword(length = 12): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (num) => charset[num % charset.length]).join("");
}
