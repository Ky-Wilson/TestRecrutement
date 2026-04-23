import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  username: string;
}

export const authenticateUser = async (identifier: string, password: string) => {
  // Recherche par username ou email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier }
      ]
    }
  });

  if (!user) {
    throw new Error("Identifiants invalides");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Identifiants invalides");
  }

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    username: user.username
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { accessToken, user };
};