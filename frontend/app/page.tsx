import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl text-center fade-in">

        <div className="inline-block glass glow px-6 py-2 rounded-full text-sm text-blue-300 mb-8 float">
          Multi-Model Deliberation Engine
        </div>

        <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-tight">
          debate
          <span className="gradient-text">X</span>
        </h1>

        <p className="mt-8 text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Ask once. Let a council of AI models debate,
          review, and synthesize the strongest answer.
        </p>

        <div className="mt-12 flex justify-center gap-4">

          <Link
            href="/login"
            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all duration-300 glow hover-glow"
          >
            Enter debateX
          </Link>

          <Link
            href="/chat"
            className="glass px-8 py-4 rounded-2xl hover:bg-white/10 transition"
          >
            Live Demo
          </Link>

        </div>
      </div>
    </main>
  );
}