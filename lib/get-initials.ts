export function getInitials(username: string): string {
  if (!username) return "??";

  // Find all capital letters in the username
  const capitals = username.match(/[A-Z]/g);

  if (capitals && capitals.length >= 2) {
    // Return first two capital letters
    return capitals.slice(0, 2).join("");
  }

  // Fallback: if less than 2 capitals, use first 2 characters
  return username.slice(0, 2).toUpperCase();
}