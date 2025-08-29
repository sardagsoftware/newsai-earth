import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyUserToken, getCookieName, hashPassword } from '../../../../lib/auth';
import { updateUser } from '../../../../lib/users';

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(getCookieName())?.value;
    if (!cookie) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const payload = verifyUserToken(cookie);
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const id = payload['id'] as string | undefined;
    if (!id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const body = (await req.json()) as { name?: string; password?: string };
  const patch: { name?: string; passwordHash?: string } = {};
    if (body.name) patch.name = body.name;
    if (body.password) patch.passwordHash = await hashPassword(body.password);
    const updated = updateUser(id, patch);
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ ok: true, user: { id: updated.id, email: updated.email, name: updated.name } });
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
