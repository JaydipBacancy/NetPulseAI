import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <AuthShell
      description="Create your NetPulse AI account to manage nodes, alerts, tests, and analysis workflows."
      eyebrow="Get started"
      footerHref="/signin"
      footerLabel="Sign in"
      footerPrompt="Already have access?"
      title="Create account"
    >
      <SignUpForm />
    </AuthShell>
  );
}
