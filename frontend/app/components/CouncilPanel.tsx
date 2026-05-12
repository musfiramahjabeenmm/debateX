export default function CouncilPanel() {
  return (
    <div className="w-[320px] glass border-l border-white/10 p-5">
      <h2 className="text-xl font-semibold">
        Council Status
      </h2>

      <div className="mt-8 glass p-6 rounded-2xl">
        <p className="text-slate-300 leading-relaxed">
          Waiting for a query to initialize the
          deliberation pipeline.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <div className="h-3 rounded-full bg-slate-700" />
          <div className="h-3 rounded-full bg-slate-700 w-[80%]" />
          <div className="h-3 rounded-full bg-slate-700 w-[60%]" />
        </div>
      </div>
    </div>
  );
}