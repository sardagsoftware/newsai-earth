import { NextResponse } from 'next/server';
import { registerUser } from '../../../../lib/auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string; name?: string };
    const { email, password, name } = body;
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const user = await registerUser(email, password, name);
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({ error: String(e.message || e) }, { status: 400 });
  }
}
