import { NextResponse } from 'next/server';
import { findUserByEmail } from '../../../../lib/users';
import { comparePassword, signUserToken, getCookieName } from '../../../../lib/auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing' }, { status: 400 });
    const user = findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const token = signUserToken({ id: user.id, email: user.email });
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set({ name: getCookieName(), value: token, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
    return res;
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
