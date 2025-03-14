import bcrypt from "bcryptjs";

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  const bcryptSaltRounds = Number.parseInt("10", 10);
  return await bcrypt.hash(password, bcryptSaltRounds);
};
