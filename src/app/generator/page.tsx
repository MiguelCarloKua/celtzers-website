"use client";
import { useState } from "react";

interface EvaluationScore {
  "rouge-1": number;
  "rouge-l": number;
  "bert-score": number;
}

interface CaseSummary {
  gr_no: string;
  facts: string;
  issues: string;
  rulings: string;
  scores: {
    facts: EvaluationScore;
    issues: EvaluationScore;
    rulings: EvaluationScore;
  };
}
type SectionKey = "facts" | "issues" | "rulings";

export default function GeneratePage() {
  const [url, setUrl] = useState("");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [result, setResult] = useState<CaseSummary | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScores, setShowScores] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("Submitting request with:", { url, direction });
      const res = await fetch("https://website-dependencies.onrender.com/generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, direction }),
      });

      const data = await res.json();
      setResult({
        ...data.summary,
        scores: data.scores,
      });
      setFileUrl(data.downloadUrl);
    } catch (error) {
      console.error("Error submitting case:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#31255e] text-white font-sans py-20">
      <div className="max-w-4xl mx-auto p-8 bg-[#523f9e] rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-center  text-white">Generate a Case Digest</h2>

        <input
          type="text"
          placeholder="Enter Lawphil URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded text-black bg-white"
        />

        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as "forward" | "backward")}
          className="w-full p-2 border rounded text-black bg-white"
        >
          <option value="forward">Forward Training (Top-Bottom)</option>
          <option value="backward">Backward Training (Bottom-Up)</option>
        </select>

        <div className="flex items-center justify-between">
        <span className="mr-4">Show Evaluation Scores</span>
        <label className="relative inline-block w-12 h-6 cursor-pointer">
            <input
            type="checkbox"
            checked={showScores}
            onChange={() => setShowScores(!showScores)}
            className="sr-only peer"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-[#614876]"></div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
        </label>
        </div>



        <button
          onClick={handleSubmit}
          className="w-full bg-[#7465b1] hover:bg-[#978bc4] py-2 rounded text-white font-semibold"
        >
          {loading ? "Processing..." : "Generate Digest"}
        </button>

          {result && (
            <div className="bg-white text-gray-900 p-6 rounded shadow space-y-6">
              <h2 className="text-2xl font-bold text-center text-[#523f9e]">Summary</h2>

                {(["facts", "issues", "rulings"] as SectionKey[]).map((section) => (
                  <div key={section} className="mb-4">
                    <h3 className="text-xl font-semibold text-[#7465b1] capitalize mb-1">{section}</h3>

                    {showScores && result.scores?.[section] && (
                      <div className="text-sm text-[#7465b1] font-medium mb-2 ml-1">
                        ROUGE-1: {result.scores[section]["rouge-1"].toFixed(2)},{" "}
                        ROUGE-L: {result.scores[section]["rouge-l"].toFixed(2)},{" "}
                        BERTScore: {result.scores[section]["bert-score"].toFixed(2)}
                      </div>
                    )}

                    {result[section].split("\n").map((line, idx) => (
                      <p key={`${section}-${idx}`} className="mb-2">{line.trim()}</p>
                    ))}
                  </div>
                ))}

            </div>
          )}

        {fileUrl && (
            <a
              href={fileUrl}
              download
              className="w-full bg-[#7465b1] hover:bg-[#978bc4] py-2 rounded text-white font-semibold text-center block mt-4"
            >
              Download Generated File
            </a>

        )}
      </div>
    </div>
  );
}
