import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from './users';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'newsai_token';

// Warn in server logs if default secret is used (not a runtime exception)
if (!process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn('Warning: JWT_SECRET is not set. Using default insecure secret. Set JWT_SECRET in production environment.');
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signUserToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyUserToken(token: string): Record<string, unknown> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function registerUser(email: string, password: string, name?: string) {
  if (findUserByEmail(email)) throw new Error('Email already registered');
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
  const passwordHash = await hashPassword(password);
  return createUser({ id, email, name, passwordHash });
}

export function getCookieName() { return COOKIE_NAME; }
