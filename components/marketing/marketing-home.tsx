import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  BrainCircuit,
  ChartNoAxesCombined,
  CheckCircle2,
  Gauge,
  RadioTower,
  ShieldCheck,
  Waypoints,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketingAssetUrls } from "@/lib/marketing/assets";

const heroSignals = [
  {
    label: "Core workflows",
    title: "Monitoring, alerts, tests, and AI analysis",
  },
  {
    label: "Access model",
    title: "Protected dashboard routes with auth-first entry",
  },
  {
    label: "Operational style",
    title: "Seeded telecom data with explainable incident context",
  },
] as const;

const capabilities: Array<{
  description: string;
  icon: LucideIcon;
  title: string;
}> = [
  {
    description:
      "Track node status, slice posture, and KPI drift without bouncing between disconnected reports.",
    icon: ChartNoAxesCombined,
    title: "Operational Visibility",
  },
  {
    description:
      "Create and resolve alerts with severity, threshold, and node context that stays audit-friendly.",
    icon: BellRing,
    title: "Incident Discipline",
  },
  {
    description:
      "Run predefined telecom checks and preserve pass-fail evidence with execution history.",
    icon: Waypoints,
    title: "Controlled Validation",
  },
];

const primaryCtaClassName =
  "bg-[#0f6c7b] text-white shadow-[0_24px_50px_-26px_rgba(15,108,123,0.95)] hover:bg-[#0c5965]";
const secondaryCtaClassName =
  "border-[#102033]/12 bg-white text-[#102033] shadow-[0_20px_44px_-30px_rgba(16,32,51,0.42)] hover:bg-[#e4f2f5] hover:text-[#102033]";

const navLinks = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#workflows", label: "Workflows" },
  { href: "#access", label: "Access" },
] as const;

type MarketingHomeProps = {
  assets: MarketingAssetUrls;
};

export function MarketingHome({ assets }: MarketingHomeProps) {
  return (
    <main className="relative min-h-screen overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,108,123,0.18),transparent_33%),radial-gradient(circle_at_88%_10%,rgba(194,119,67,0.14),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0)_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[24rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#0f6c7b]/12 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <header className="rounded-[1.9rem] border border-[#102033]/8 bg-white/72 shadow-[0_30px_80px_-58px_rgba(9,22,41,0.82)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-[#0f6c7b]/16 bg-[#0f6c7b]/10 text-[#0f6c7b]">
                <RadioTower className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a798b]">
                  NetPulse AI
                </p>
                <p className="text-base font-semibold text-[#102033]">5G Operations Platform</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => (
                <Link
                  className="text-sm font-medium text-[#5c6c7d] transition-colors hover:text-[#102033]"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap gap-2">
              <Button asChild className={secondaryCtaClassName} size="sm" variant="outline">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild className={primaryCtaClassName} size="sm">
                <Link href="/signup">Create account</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-8 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-14">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#0f6c7b]/12 text-[#0f6c7b] hover:bg-[#0f6c7b]/12">
                Telecom-grade workflow
              </Badge>
              <Badge className="bg-white/80 text-[#536273] hover:bg-white/80" variant="outline">
                Modern command surface
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance text-[#102033] sm:text-5xl lg:text-6xl">
                Operate 5G monitoring, alerts, and validation from one credible control surface.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#536273] sm:text-[1.05rem]">
                NetPulse AI is built for telecom teams that need a focused workspace for node
                health, alert handling, predefined test execution, and AI summaries grounded in
                concrete network context.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className={primaryCtaClassName} size="lg">
                <Link href="/signup">
                  Launch the workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild className={secondaryCtaClassName} size="lg" variant="outline">
                <Link href="/signin">Enter existing account</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div
                  className="rounded-[1.5rem] border border-[#102033]/8 bg-white/72 p-4 shadow-[0_18px_50px_-40px_rgba(10,24,40,0.75)]"
                  key={signal.label}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a8998]">
                    {signal.label}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#102033]">
                    {signal.title}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-[#102033]/8 bg-white/72 p-5 shadow-[0_20px_55px_-45px_rgba(10,24,40,0.82)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#718193]">
                    Built for believable telecom demos
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#102033]">
                    Stronger narrative, clearer priorities, cleaner handoffs.
                  </h2>
                </div>
                <Badge className="bg-[#102033] text-white hover:bg-[#102033]">Ops-first UX</Badge>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <InlineDetail
                  icon={Gauge}
                  title="Health posture"
                  value="Node status, slice alignment, and KPI drift stay visible from the first screen."
                />
                <InlineDetail
                  icon={ShieldCheck}
                  title="Alert context"
                  value="Severity, thresholds, and affected nodes remain readable enough for fast triage."
                />
                <InlineDetail
                  icon={BrainCircuit}
                  title="AI grounding"
                  value="Summaries reference concrete alerts, tests, and nodes instead of vague generic copy."
                />
              </div>
            </div>
          </div>

          <Card className="relative overflow-hidden border-[#081e29]/10 bg-[#07171f] text-white shadow-[0_36px_90px_-50px_rgba(7,23,31,0.95)] animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(50,136,155,0.28),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
            <CardContent className="relative space-y-5 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Platform snapshot
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Designed like an operations cockpit
                  </p>
                </div>
                <Badge className="bg-white/12 text-white hover:bg-white/12">Protected dashboard</Badge>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
                <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0d2734]">
                  <Image
                    alt="NetPulse AI dashboard preview showing monitoring and analysis panels."
                    className="h-full w-full object-cover"
                    height={960}
                    priority
                    sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 44vw, 100vw"
                    src={assets.hero}
                    width={1400}
                  />
                </div>

                <div className="grid gap-3">
                  <DarkSignalCard
                    detail="Consumer slice throughput remains the highest-impact issue in the west region."
                    icon={BellRing}
                    label="Priority lane"
                    value="Mumbai RAN 09"
                  />
                  <DarkSignalCard
                    detail="Delhi URLLC latency and jitter point to scheduler imbalance during peak load."
                    icon={BrainCircuit}
                    label="AI brief"
                    value="Telemedicine drift"
                  />
                  <DarkSignalCard
                    detail="Predefined checks keep pass-fail evidence attached to thresholds and execution time."
                    icon={Workflow}
                    label="Validation"
                    value="Auditable results"
                  />
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10">
                    <RadioTower className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Professional by default</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Clear CTA contrast and calmer visual hierarchy
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  The landing page now prioritizes readable buttons, stronger structure, and a more
                  credible telecom presentation instead of a generic startup hero.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="py-8 sm:py-10" id="capabilities">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#718193]">
                Core capabilities
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#102033] sm:text-4xl">
                A lean product scope with the right amount of telecom realism.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#5c6c7d] sm:text-base">
              The experience stays focused on the hackathon brief: monitoring, alerts, predefined
              test execution, AI analysis, and concise reporting for operational review.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {capabilities.map((capability) => (
              <CapabilityCard key={capability.title} {...capability} />
            ))}
          </div>
        </section>

        <section className="grid gap-5 py-4 lg:grid-cols-2" id="workflows">
          <WorkflowPanel
            description="Show the health picture first, then move teams cleanly into node-level investigation and alert handling."
            eyebrow="Operations narrative"
            imageAlt="NetPulse AI operations view with monitoring dashboards and telecom command screens."
            imageSrc={assets.operations}
            points={[
              "Health and incident context appear before generic marketing claims.",
              "Telecom labels, slices, and node references keep the story believable.",
              "The visual direction reads closer to a product console than a landing template.",
            ]}
            title="Give operators a more serious first impression."
          />
          <WorkflowPanel
            description="Balance automation with traceability so the product feels controlled, explainable, and ready for demo walkthroughs."
            eyebrow="Execution model"
            imageAlt="NetPulse AI workflow visual showing automated tests and alert-driven operational flow."
            imageSrc={assets.workflow}
            points={[
              "Predefined tests reinforce repeatability instead of open-ended automation.",
              "AI analysis is framed as support, not as magic detached from the metrics.",
              "Primary and secondary CTAs now use high-contrast colors for immediate readability.",
            ]}
            title="Keep the automation story disciplined and readable."
          />
        </section>

        <section className="pt-6" id="access">
          <Card className="overflow-hidden border-[#102033]/10 bg-[linear-gradient(135deg,#f7fbfb_0%,#edf6f7_56%,#f4efe8_100%)] shadow-[0_28px_80px_-58px_rgba(9,22,41,0.84)]">
            <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#718193]">
                  Ready for access
                </p>
                <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#102033] sm:text-4xl">
                  Enter the demo with clearer calls to action and a more polished front door.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[#566678] sm:text-base">
                  Create an account to walk through the full workflow, or sign in directly if you
                  already have access to the dashboard environment.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className={primaryCtaClassName} size="lg">
                  <Link href="/signup">
                    Create account
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild className={secondaryCtaClassName} size="lg" variant="outline">
                  <Link href="/signin">Sign in now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function InlineDetail({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-[#102033]/8 bg-[#f9fbfb] p-4">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-[#0f6c7b]/10 text-[#0f6c7b]">
        <Icon className="size-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-[#102033]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#5c6c7d]">{value}</p>
    </div>
  );
}

function CapabilityCard({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <Card className="border-[#102033]/8 bg-white/72 shadow-[0_20px_54px_-44px_rgba(10,24,40,0.82)]">
      <CardHeader className="gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-[#0f6c7b]/16 bg-[#0f6c7b]/10 text-[#0f6c7b]">
          <Icon className="size-5" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg text-[#102033]">{title}</CardTitle>
          <p className="text-sm leading-7 text-[#5c6c7d]">{description}</p>
        </div>
      </CardHeader>
    </Card>
  );
}

function DarkSignalCard({
  detail,
  icon: Icon,
  label,
  value,
}: {
  detail: string;
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 shadow-[0_22px_50px_-36px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#2f90a2]/18 text-[#95e1ea]">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-white">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p>
    </div>
  );
}

function WorkflowPanel({
  description,
  eyebrow,
  imageAlt,
  imageSrc,
  points,
  title,
}: {
  description: string;
  eyebrow: string;
  imageAlt: string;
  imageSrc: string;
  points: string[];
  title: string;
}) {
  return (
    <Card className="overflow-hidden border-[#102033]/8 bg-white/74 shadow-[0_24px_60px_-46px_rgba(10,24,40,0.84)]">
      <div className="overflow-hidden border-b border-[#102033]/8 bg-[#eef5f6]">
        <Image
          alt={imageAlt}
          className="h-auto w-full object-cover"
          height={900}
          sizes="(min-width: 1024px) 34vw, 100vw"
          src={imageSrc}
          width={1400}
        />
      </div>
      <CardContent className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#718193]">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#102033]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#5c6c7d] sm:text-base">{description}</p>
        <div className="mt-5 space-y-3">
          {points.map((point) => (
            <div className="flex items-start gap-3" key={point}>
              <CheckCircle2 className="mt-0.5 size-5 text-[#0f6c7b]" />
              <p className="text-sm leading-6 text-[#445466]">{point}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
