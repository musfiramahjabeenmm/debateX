type Props = {
  role: "user" | "assistant";
  text: string;
};

export default function MessageBubble({
  role,
  text,
}: Props) {
  return (
    <div
      className={`max-w-3xl p-5 rounded-3xl leading-relaxed slide-up ${
        role === "user"
          ? "bg-blue-600 ml-auto"
          : "glass"
      }`}
    >
      {text}
    </div>
  );
}