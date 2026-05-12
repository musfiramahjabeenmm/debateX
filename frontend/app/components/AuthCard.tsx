type Props = {
  title: string;
  button: string;
};

export default function AuthCard({
  title,
  button,
}: Props) {
  return (
    <div className="glass glow w-[420px] p-10 rounded-3xl">
      <div>
        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        <p className="mt-3 text-slate-400">
          Welcome to debateX
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="bg-white/5 border border-white/10 p-4 rounded-2xl"
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-white/5 border border-white/10 p-4 rounded-2xl"
        />

        <button className="mt-2 bg-blue-600 hover:bg-blue-500 transition-all p-4 rounded-2xl font-medium glow">
          {button}
        </button>
      </div>
    </div>
  );
}