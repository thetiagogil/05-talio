const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginEmail = (email: string) => {
  const nextEmail = email.trim();

  if (!nextEmail) {
    return "Enter your work email.";
  }

  if (!emailPattern.test(nextEmail)) {
    return "Enter a valid email address.";
  }

  return null;
};
