import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyUserToken, getCookieName } from '../../../../lib/auth';
import { listUsers } from '../../../../lib/users';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(getCookieName())?.value;
    if (!cookie) return NextResponse.json({ user: null });
    const payload = verifyUserToken(cookie);
    if (!payload) return NextResponse.json({ user: null });
    const id = payload['id'] as string | undefined;
    if (!id) return NextResponse.json({ user: null });
    const user = listUsers().find(u => u.id === id);
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (_err) {
    return NextResponse.json({ user: null });
  }
}
