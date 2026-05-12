import AuthCard from "../components/AuthCard";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <AuthCard
        title="Create Account"
        button="Sign Up"
      />
    </main>
  );
}