import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { config } from 'dotenv';

config(); // Load .env

export async function POST(req: Request) {
  const body = await req.json();

  const fastApiUrl = process.env.FASTAPI_URL || 'https://celtzers-website.onrender.com';

  try {
    const res = await fetch(fastApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ FastAPI error:', err);
    return NextResponse.json({ error: 'Failed to reach backend' }, { status: 500 });
  }
}