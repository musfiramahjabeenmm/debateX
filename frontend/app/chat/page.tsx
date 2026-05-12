import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";
import CouncilPanel from "../components/CouncilPanel";

export default function ChatPage() {
  return (
    <main className="h-screen flex overflow-hidden fade-in">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">

            <div className="inline-block glass px-5 py-2 rounded-full text-sm text-blue-300 mb-6 float">
              debateX Council Ready
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Ask the council.
            </h1>

            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
              Multiple AI models will independently reason,
              review each other anonymously, and synthesize
              the strongest final answer.
            </p>

          </div>
        </div>

        <ChatInput />

      </div>

      <CouncilPanel />

    </main>
  );
}