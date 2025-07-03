import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(req: Request) {
  const body = await req.json();
  const { url, direction } = body;

  return new Promise((resolve) => {
    const python = spawn('python3', ['python/training.py', url, direction]);

    let output = '';
    python.stdout.on('data', (data) => output += data.toString());
    python.stderr.on('data', (data) => console.error("stderr:", data.toString()));

    python.on('close', () => {
      try {
        const parsed = JSON.parse(output);
        resolve(NextResponse.json(parsed));
      } catch (err) {
        console.error("❌ Failed to parse:", err);
        resolve(NextResponse.json({ error: 'Failed to parse Python output' }, { status: 500 }));
      }
    });
  });
}
