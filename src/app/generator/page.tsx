"use client";
import { useState, useEffect } from "react";

interface EvaluationScore {
  "rouge-1": number;
  "rouge-l": number;
  "bert-score": number;
  sentence_scores?: {
    "rouge-1": number;
    "rouge-l": number;
    "bert-score": number;
  }[];
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
  metadata?: { [key: string]: string };
}
type SectionKey = "facts" | "issues" | "rulings";

export default function GeneratePage() {
  const [url, setUrl] = useState("");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [result, setResult] = useState<CaseSummary | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState("Initializing...");
  const [history, setHistory] = useState<{ gr: string; url: string }[]>([]);
  const [downloads, setDownloads] = useState<
    { gr: string; direction: string; url: string }[]
  >([]);
  // Load from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("caseHistory");
    const storedDownloads = localStorage.getItem("caseDownloads");

    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      if (Array.isArray(parsed)) {
        // Assume all are correct objects
        setHistory(parsed);
      }
    }

    if (storedDownloads) {
      setDownloads(JSON.parse(storedDownloads));
    }
  }, []);


  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("caseHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("caseDownloads", JSON.stringify(downloads));
  }, [downloads]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setProgress(5);
      setProgressText("🔍 Fetching case...");

      const res = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, direction, evaluate: showScores }),
      });

      if (!res.ok) throw new Error("API request failed");

      // Initial fetch and parse complete
      setProgress(25);
      setProgressText("📑 Parsing metadata and splitting sections...");

      const data = await res.json();

      setProgress(40);
      setProgressText("🧠 Generating facts...");

      // Wait slightly to simulate Gemini delay (optional)
      await new Promise((r) => setTimeout(r, 300));

      setProgress(50);
      setProgressText("🧠 Generating issues...");

      await new Promise((r) => setTimeout(r, 300));

      setProgress(60);
      setProgressText("🧠 Generating rulings...");

      await new Promise((r) => setTimeout(r, 300));

      setProgress(70);
      setProgressText("📦 Formatting outputs...");

      setResult({
        ...data.summary,
        scores: data.scores,
        metadata: data.metadata,
      });

      setFileUrl(data.downloadUrl);

      setHistory((prev) => [
        { gr: data.metadata["G.R. Number"], url },
        ...prev.filter((item) => item.url !== url),
      ]);

      if (data.downloadUrl) {
        setDownloads((prev) => [
          { gr: data.metadata["G.R. Number"], direction, url: data.downloadUrl },
          ...prev,
        ]);
      }

      setProgress(85);
      setProgressText(showScores ? "📊 Evaluating summaries..." : "📝 Skipping evaluation...");

      await new Promise((r) => setTimeout(r, 500));

      setProgress(100);
      setProgressText("✅ Digest ready!");

    } catch (error) {
      console.error("❌ Error:", error);
      setProgressText("❌ Failed to generate digest.");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setProgressText("");
      }, 1500); // Hold success state briefly before resetting
    }
  };




  return (
    
  <div className="min-h-screen flex bg-[#31255e] text-white font-sans">
    
    {/* LEFT SIDEBAR: Previous G.R. Cases */}
    <div className="hidden lg:flex flex-col w-64 p-4 bg-[#2a1f4d] space-y-4 overflow-y-auto">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold"> Previous Cases</h3>
        <button
          onClick={() => setHistory([])}
          className="text-xs bg-[#614876] hover:bg-[#7d65aa] text-white px-3 py-1 rounded transition"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setUrl(item.url)}
            className="block w-full text-left bg-[#3b2c66] hover:bg-[#4d3a82] p-2 rounded text-sm truncate"
          >
            {item.gr}
          </button>
        ))}
      </div>

    </div>


    <div className="flex-1 px-8 py-20">
      <div className="max-w-3xl mx-auto p-8 bg-[#523f9e] rounded-lg shadow-lg space-y-6">
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative mb-4">
            <div
              className="bg-[#7465b1] h-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
              <div
                className={`absolute inset-0 flex items-center justify-center text-xs font-semibold transition-all ${
                  progress >= 80 ? "text-white" : "text-black"
                }`}
                style={{
                  textShadow: "0 0 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                {progressText}
              </div>

          </div>
        )}
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
          <option value="forward">Read the Case Top to Bottom</option>
          <option value="backward">Read the Case Bottom to Top</option>
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
              {result.metadata && (
                <h2 className="text-2xl font-bold text-center text-[#523f9e]">
                  {result.metadata?.Petitioners} vs. {result.metadata?.Respondents}
                </h2>
              )}

                
              {result.metadata && (
                <div className="bg-gray-100 rounded p-4 mb-6">
                  <ul className="text-sm text-gray-800 space-y-1">
                    {Object.entries(result.metadata)
                      .filter(([key]) => key !== "Is En Banc") // Remove only "Is En Banc"
                      .map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </li>
                    ))}
                  </ul>
                </div>
              )}


                {(["facts", "issues", "rulings"] as SectionKey[]).map((section) => (
                  <div key={section} className="mb-4">
                    <h3 className="text-xl font-semibold text-[#7465b1] capitalize mb-1">{section}</h3>

                    {/* {showScores && result.scores?.[section] && (
                      <div className="text-sm text-[#7465b1] font-medium mb-2 ml-1">
                        ROUGE-1: {result.scores[section]["rouge-1"].toFixed(2)},{" "}
                        ROUGE-L: {result.scores[section]["rouge-l"].toFixed(2)},{" "}
                        BERTScore: {result.scores[section]["bert-score"].toFixed(2)}
                      </div>
                    )} */}

                  {result[section] &&
                    result[section].split("\n").map((line, idx) => (
                      <div key={`${section}-${idx}`} className="mb-2">
                        <p>{line.trim()}</p>
                        {showScores && result.scores?.[section]?.sentence_scores?.[idx] && (
                          <p className="text-sm text-[#aaa] ml-2">
                            BERTScore: {result.scores[section].sentence_scores[idx]["bert-score"].toFixed(2)}
                          </p>
                        )}
                      </div>
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

    {/* RIGHT SIDEBAR: Quick Downloads */}
    <div className="hidden lg:flex flex-col w-64 p-4 bg-[#2a1f4d] space-y-4 overflow-y-auto">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold">Quick Downloads</h3>
        <button
          onClick={() => setDownloads([])}
          className="text-xs bg-[#614876] hover:bg-[#7d65aa] text-white px-3 py-1 rounded transition"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {downloads.map((d, idx) => {
          const safeGr = d.gr.replace(/ /g, "_");  
          return (
            <a
              key={idx}
              href={`/downloads/${safeGr}_${d.direction}_digested.docx`}
              download
              className="block bg-[#3b2c66] hover:bg-[#4d3a82] p-2 rounded text-sm truncate"
            >
              {d.gr} ({d.direction})
            </a>
          );
        })}

      </div>
    </div>
    </div>
  );
}
