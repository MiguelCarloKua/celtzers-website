export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#31255e] text-white text-center py-32">
      <h2 className="text-4xl font-bold  text-white mb-6">About Us</h2>
      <p className="text-lg max-w-xl mx-auto">
        Lawlite is a Case Digest Generator Tool developed by Pierre Genric Cabinbin, Jordan Chester Chong, Miguel Carlo Kua, and Rommel Kendrick Salen. The group created this tool as an aid for students who are interested in knowing the context of any
        Philippine Court Case from Lawphil, a jurisprudence repository by the Arellano University School of Law in the Philippines. This tool is integrated with Google's Gemini 2.5 Flash to create simple yet informative case digests in a hassle-free process. Do note that this tool is solely for supplementary use only and not to be a sole basis of comprehending court cases as it may generate incorrect information.
      </p>
    </main>
  );
}
