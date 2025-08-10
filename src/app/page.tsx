import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#31255e] text-white font-sans">
      <section className="py-20 text-center">
        {/* Intro Container */}
        <div className="max-w-2xl mx-auto bg-[#3f3175] p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-3xl font-bold text-[#978bc4] mb-4">Welcome to Lawlite</h2>
          <p className="text-lg">
            Generate clean, structured case digests from Lawphil in one click. Whether you&apos;re a
            student or lawyer, we&apos;ll help you summarize key legal decisions with confidence.
          </p>
          <Link
            href="/generator"
            className="inline-block mt-6 px-6 py-3 bg-[#978bc4] text-white font-semibold rounded-lg hover:bg-[#7d70a8] transition"
          >
            Go to Generator
          </Link>
        </div>

        {/* About the Tool Container */}
        <div className="max-w-2xl mx-auto bg-[#3f3175] p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-3xl font-bold text-[#978bc4] mb-4">About the Tool</h2>
          <p className="text-lg">
            Lawlite is a Case Digest Generator Tool developed by Pierre Genric Cabinbin, Jordan
            Chester Chong, Miguel Carlo Kua, and Rommel Kendrick Salen. The group created this tool
            as an aid for students who are interested in knowing the context of any Philippine Court
            Case from Lawphil, a jurisprudence repository by the Arellano University School of Law
            in the Philippines. This tool is integrated with Google&apos;s Gemini 2.5 Flash to create
            simple yet informative case digests in a hassle-free process.
          </p>
        </div>

        {/* Disclaimer Container */}
        <div className="max-w-2xl mx-auto bg-[#3f3175] p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-[#978bc4] mb-4">Disclaimer</h2>
          <p className="text-lg">
            This tool is intended solely for supplementary academic use and should not be relied upon
            as the sole basis for understanding or interpreting court cases. Generated outputs may
            contain inaccuracies or incomplete information, and users are encouraged to consult the
            original case files and other reliable legal resources for comprehensive understanding.
          </p>
        </div>
      </section>
    </main>
  );
}
