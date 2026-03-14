export const phaseOneStatusRows = [
  { label: "Scaffold", value: "Next.js 16 + App Router" },
  { label: "Runtime", value: "Server Components, Actions, and Route Handlers" },
  { label: "UI base", value: "Tailwind v4 + shadcn/ui + Sonner" },
  { label: "Data/Auth base", value: "Supabase SSR clients and env helpers" },
  { label: "Validation", value: "Zod at the form and server boundary" },
] as const;

export const phaseOneStack = [
  "Next.js App Router",
  "Server Components",
  "Route Handlers",
  "Server Actions",
  "TypeScript strict mode",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Supabase SSR",
  "Zod",
  "Sonner",
] as const;

export const phaseOneRoutes = [
  "app/(auth)/signin",
  "app/(auth)/signup",
  "app/(dashboard)/dashboard",
  "app/(dashboard)/nodes",
  "app/(dashboard)/alerts",
  "app/(dashboard)/tests",
  "app/(dashboard)/analysis",
  "app/(dashboard)/reports",
] as const;

export const phaseOneFeatureFolders = [
  "components/ui",
  "components/auth",
  "components/dashboard",
  "components/alerts",
  "components/tests",
  "components/reports",
] as const;

export const phaseOneLibraries = [
  "lib/analysis",
  "lib/data",
  "lib/supabase",
  "lib/validations",
  "hooks",
  "types",
  "app/api",
] as const;

export const phaseOneDependencies = [
  "tailwindcss",
  "shadcn/ui",
  "@supabase/ssr",
  "@supabase/supabase-js",
  "zod",
  "sonner",
] as const;
