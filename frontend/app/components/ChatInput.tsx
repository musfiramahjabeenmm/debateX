export default function ChatInput() {
  return (
    <div className="p-6">
      <div className="glass rounded-3xl p-3 flex items-center gap-4 transition-all focus-within:border-blue-500">

        <input
          type="text"
          placeholder="Ask the council anything..."
          className="flex-1 bg-transparent px-4 text-white placeholder:text-slate-500"
        />

        <button className="bg-blue-600 hover:bg-blue-500 transition-all duration-300 px-6 py-3 rounded-2xl glow hover-glow">
          Send
        </button>

      </div>
    </div>
  );
}