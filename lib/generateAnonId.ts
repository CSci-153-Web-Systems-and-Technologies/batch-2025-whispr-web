import adjectivesData from '@/data/adjectives.json'
import beingsData from '@/data/beings.json'

export function generateAnonId():string  {
  const adjectives: string[] = adjectivesData.adjectives;
  const beings: string[] = beingsData.beings;
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomBeing = beings[Math.floor(Math.random() * beings.length)];
  const randomNumber = Math.floor(Math.random() * 100).toString().padStart(2, "0"); 

  return `${randomAdjective}${randomBeing}${randomNumber}`;
}