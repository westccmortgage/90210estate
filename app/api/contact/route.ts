import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Always handle at request time — this route sends email, it is not static.
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const message = str(body.message);
  const subject = str(body.subject);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: 'Please provide your name, email, and a message.' },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'Please provide a valid email address.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'westccmortgage@gmail.com';
  // NOTE: the "from" address must be on a domain verified in your email
  // provider (Resend). Set CONTACT_FROM_EMAIL once westccrealty.com is verified.
  const from = process.env.CONTACT_FROM_EMAIL || '90210 Estate <onboarding@resend.dev>';

  // Not configured yet: report a specific status so the client can fall back
  // to opening the visitor's email client (mailto) instead of failing silently.
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const subjectLine = subject
    ? `Website inquiry — ${subject}`
    : 'New website inquiry';

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    subject ? `Regarding: ${subject}` : null,
    '',
    message,
  ].filter((l): l is string => l !== null);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: subjectLine,
        text: lines.join('\n'),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Resend send failed', res.status, detail);
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact route error', err);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
}
