import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), '.data');
const USERS_FILE = path.join(DB_PATH, 'users.json');

type User = {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  createdAt: string;
};

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) fs.mkdirSync(DB_PATH);
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
}

export function listUsers(): User[] {
  ensureDb();
  const raw = fs.readFileSync(USERS_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

export function findUserByEmail(email: string): User | undefined {
  return listUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: Omit<User, 'createdAt'>) {
  ensureDb();
  const users = listUsers();
  users.push({ ...user, createdAt: new Date().toISOString() });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return users[users.length - 1];
}

export function updateUser(id: string, patch: Partial<User>) {
  ensureDb();
  const users = listUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return users[idx];
}
