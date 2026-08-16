import Link from "next/link";
import {
  Shield,
  FolderLock,
  FileText,
  ListChecks,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl accent-soft flex items-center justify-center">
            <Shield className="w-5 h-5 text-teal" />
          </span>
          <span className="text-xl font-bold text-gradient tracking-tight">FamilyVault</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-semibold bg-teal text-[#08090D] rounded-lg hover:bg-teal-light glow-accent transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 accent-soft rounded-full px-3 py-1 text-xs font-medium text-teal mb-8">
          <ShieldCheck className="w-3.5 h-3.5" />
          Private &amp; encrypted by design
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
          Protect What Matters.
          <br />
          <span className="text-gradient">Build Your Legacy.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Your family&apos;s single source of truth for estate planning,
          insurance coverage, and emergency preparedness. Everything your
          loved ones need, organized and secure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-teal text-[#08090D] font-semibold rounded-xl px-6 py-3 hover:bg-teal-light glow-accent transition text-lg"
          >
            Start Protecting Your Family
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center glass border border-border rounded-xl px-6 py-3 hover:bg-white/[0.05] transition text-lg font-medium"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FolderLock,
              title: "Digital Emergency Binder",
              desc: "Contacts, legal documents, financial accounts, insurance policies, bills, and digital access — everything organized in one place.",
            },
            {
              icon: ListChecks,
              title: "Action Plan",
              desc: "A step-by-step roadmap for protecting your family. Track progress through each phase, from estate documents to long-term planning.",
            },
            {
              icon: ShieldCheck,
              title: "Insurance Gap Analysis",
              desc: "Know exactly how much coverage your family needs. Identify gaps and get clear recommendations.",
            },
            {
              icon: GraduationCap,
              title: "529 College Calculator",
              desc: "Project your college savings growth with tax-free compound interest. See coverage across university tiers.",
            },
            {
              icon: FileText,
              title: "Letter of Intent",
              desc: "Write a personal letter with your wishes, values, and guidance for your family. The most important document you\u2019ll ever create.",
            },
            {
              icon: Shield,
              title: "Shared Household Access",
              desc: "Both spouses see the same data. Invite your partner so either of you can find what you need, when you need it.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass card-hover rounded-2xl p-5"
            >
              <span className="w-11 h-11 rounded-xl accent-soft flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-teal" />
              </span>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-muted-foreground text-sm border-t border-border">
        <p>&copy; 2026 FamilyVault. Your data stays private and encrypted.</p>
      </footer>
    </div>
  );
}
