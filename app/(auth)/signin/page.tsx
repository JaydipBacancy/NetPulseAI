import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <AuthShell
      description="Use your NetPulse AI credentials to access the telecom monitoring workspace."
      eyebrow="Welcome back"
      footerHref="/signup"
      footerLabel="Create an account"
      footerPrompt="Need access?"
      title="Sign in"
    >
      <SignInForm />
    </AuthShell>
  );
}
