export default function Sidebar() {
  return (
    <div className="w-[280px] glass border-r border-white/10 p-5 flex flex-col">

      <button className="bg-blue-600 hover:bg-blue-500 transition-all duration-300 p-4 rounded-2xl font-medium glow hover-glow">
        + New Debate
      </button>

      <div className="mt-10">
        <p className="text-sm text-slate-400 mb-4">
          Council Members
        </p>

        <div className="space-y-3">

          <div className="glass p-4 rounded-2xl hover-glow">
            GPT-4o
          </div>

          <div className="glass p-4 rounded-2xl hover-glow">
            Claude Sonnet
          </div>

          <div className="glass p-4 rounded-2xl hover-glow">
            Gemini Pro
          </div>

          <div className="glass p-4 rounded-2xl hover-glow">
            Grok
          </div>

        </div>
      </div>
    </div>
  );
}