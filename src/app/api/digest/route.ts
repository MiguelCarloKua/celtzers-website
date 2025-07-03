import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { config } from 'dotenv';

config(); // Load env vars

export async function POST(req: Request) {
  const body = await req.json();
  const { url, direction } = body;

  return new Promise((resolve) => {
    const python = spawn('python', ['python/training.py', url, direction]);
    let output = '';
    python.stdout.on('data', (data) => (output += data.toString()));
    python.stderr.on('data', (data) => {
      console.error('🚨 Python stderr:', data.toString());
    });

  python.on('close', () => {
    if (!output.trim()) {
      return resolve(NextResponse.json({ error: 'No output received from Python script' }, { status: 500 }));
    }
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
