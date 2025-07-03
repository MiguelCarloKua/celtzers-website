"use client";
import { useState } from 'react';

interface CaseSummary {
  gr_no: string;
  facts: string;
  issues: string;
  rulings: string;
}

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [result, setResult] = useState<CaseSummary | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, direction }),
      });

      const data = await res.json();
      setResult(data.summary);
      setFileUrl(data.downloadUrl);
    } catch (error) {
      console.error("Error submitting case:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-2xl mx-auto space-y-6 text-white bg-gray-900">
      <h1 className="text-3xl font-bold">Case Digester</h1>

      <input
        type="text"
        placeholder="Enter Lawphil URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Accessible label for select element */}
      <label htmlFor="direction" className="sr-only">Training Direction</label>
      <select
        id="direction"
        value={direction}
        onChange={(e) => setDirection(e.target.value as 'forward' | 'backward')}
        className="w-full p-2 border rounded"
      >
        <option value="forward">Forward Training (Top-Down)</option>
        <option value="backward">Backward Training (Bottom-Up)</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Generate Digest'}
      </button>

      {result && (
        <div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 p-4 rounded space-y-4 shadow">
          <h2 className="text-xl font-semibold">Summary</h2>
          <p><span className="font-semibold">Facts:</span> {result.facts}</p>
          <p><span className="font-semibold">Issues:</span> {result.issues}</p>
          <p><span className="font-semibold">Rulings:</span> {result.rulings}</p>
        </div>
      )}


      {fileUrl && (
        <a href={fileUrl} download className="block mt-4 text-blue-600 underline">
          Download Generated File
        </a>
      )}
    </main>
  );
}
