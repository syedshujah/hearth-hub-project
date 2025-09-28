/**
 * Generate avatar initials from email address
 * Takes the first two characters of the email (before @) and converts to lowercase
 * Example: user@example.com → "us"
 */
export const getEmailInitials = (email: string | null | undefined): string => {
  if (!email) return "u";
  
  // Extract the part before @ symbol
  const username = email.split("@")[0];
  
  // Take first two characters and convert to lowercase
  const initials = username.slice(0, 2).toLowerCase();
  
  // Ensure we have at least one character
  return initials || "u";
};

/**
 * Generate initials from full name (fallback method)
 * Takes first letter of each word, up to 2 letters
 */
export const getNameInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
