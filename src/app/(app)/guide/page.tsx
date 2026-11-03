"use client";

import {
  Shield,
  FolderLock,
  ListChecks,
  GraduationCap,
  ShieldCheck,
  FileDown,
  Heart,
  Clock,
  BookOpen,
  Users,
  FileText,
  KeyRound,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

export default function GuidePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient">
          Welcome to FamilyVault
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          A quick guide to what this app does and why it matters
        </p>
      </div>

      {/* Why this exists */}
      <Card className="glow-accent">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-coral" />
          </div>
          <div>
            <CardTitle className="text-base text-foreground font-semibold">
              Why We Built This
            </CardTitle>
            <div className="mt-3 space-y-3 text-sm text-foreground/80 leading-relaxed">
              <p>
                When Rupert Murdoch had a medical emergency in 2018, even his
                billionaire family scrambled. They didn&apos;t know where
                documents were, who to call, or what was covered. If it can
                happen to them, it can happen to anyone.
              </p>
              <p>
                As new parents, we have a responsibility to make sure that if
                anything ever happened to one of us, the other person
                wouldn&apos;t be left scrambling. Not because we expect the
                worst &mdash; but because being prepared is one of the most
                loving things we can do for each other.
              </p>
              <p>
                FamilyVault is our family&apos;s digital safety net. It keeps
                all of our critical information organized in one place so that
                either of us can find what we need, when we need it.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* What's inside */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-teal" />
          </div>
          What&apos;s Inside
        </h2>

        <div className="space-y-4">
          {/* Emergency Binder */}
          <Card className="card-hover">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center shrink-0">
                <FolderLock className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Emergency Binder
                </p>
                <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
                  This is the heart of the app &mdash; a digital version of the
                  classic &ldquo;emergency binder&rdquo; that financial planners
                  recommend every family have. It has seven sections:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Contacts</strong>{" "}
                      &mdash; Our key people: attorney, financial advisor,
                      insurance agent, accountant, and emergency contacts.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Legal Documents
                      </strong>{" "}
                      &mdash; Track the status of our will, trust, power of
                      attorney, healthcare directives, and other critical legal
                      docs.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Financial Accounts
                      </strong>{" "}
                      &mdash; A master list of all our bank accounts,
                      investments, and retirement accounts with key details.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Insurance Policies
                      </strong>{" "}
                      &mdash; All our policies (life, health, home, auto,
                      umbrella) with coverage amounts and policy numbers.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Receipt className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Monthly Bills</strong>{" "}
                      &mdash; Every recurring bill so nothing gets missed if one
                      of us is unavailable.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <KeyRound className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Digital Access</strong>{" "}
                      &mdash; How to access important digital accounts,
                      password manager info, and recovery details.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Letter of Intent
                      </strong>{" "}
                      &mdash; A personal letter with our wishes, values, and
                      guidance for our family. Not legally binding, but
                      incredibly important.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Plan */}
          <Card className="card-hover">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center shrink-0">
                <ListChecks className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Action Plan</p>
                <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
                  A step-by-step checklist that walks us through everything we
                  need to do, organized into phases. Think of it as our family
                  protection to-do list &mdash; from getting a will drafted to
                  setting up the right insurance coverage. We can track progress
                  together and check things off as we go.
                </p>
              </div>
            </div>
          </Card>

          {/* Insurance Gap */}
          <Card className="card-hover">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Insurance Gap Analysis
                </p>
                <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
                  Shows whether our life insurance coverage is enough to protect
                  our family based on our income, debts, and future needs (like
                  the kids&apos; education). If there&apos;s a gap, it helps us
                  understand how much more coverage we might need.
                </p>
              </div>
            </div>
          </Card>

          {/* 529 Calculator */}
          <Card className="card-hover">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-navy-light" />
              </div>
              <div>
                <p className="font-semibold text-foreground">529 Calculator</p>
                <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
                  Helps us plan for the kids&apos; college education. Enter how
                  much we&apos;re saving and it projects whether we&apos;re on
                  track, factoring in tuition inflation and investment growth.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* How to use it */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-teal" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base text-foreground font-semibold">
              How to Use It
            </CardTitle>
            <div className="mt-3 space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>
                You don&apos;t need to fill everything out at once. Here&apos;s
                a simple approach:
              </p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full accent-soft flex items-center justify-center font-semibold text-teal shrink-0 text-sm">
                    1
                  </span>
                  <span className="mt-1.5">
                    <strong>Start with Contacts</strong> &mdash; Add our key
                    people (attorney, insurance agent, financial advisor). This
                    takes 5 minutes.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full accent-soft flex items-center justify-center font-semibold text-teal shrink-0 text-sm">
                    2
                  </span>
                  <span className="mt-1.5">
                    <strong>Check the Action Plan</strong> &mdash; See what steps
                    we&apos;ve completed and what&apos;s next. Pick one thing to
                    work on together.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full accent-soft flex items-center justify-center font-semibold text-teal shrink-0 text-sm">
                    3
                  </span>
                  <span className="mt-1.5">
                    <strong>Fill in over time</strong> &mdash; Add accounts,
                    policies, and bills as you come across them. There&apos;s no
                    rush.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full accent-soft flex items-center justify-center font-semibold text-teal shrink-0 text-sm">
                    4
                  </span>
                  <span className="mt-1.5">
                    <strong>Review together quarterly</strong> &mdash; Set a
                    reminder to review and update everything every few months.
                  </span>
                </li>
              </ol>
              <p>
                We both have access to the same data, so either of us can add or
                update information anytime.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Important note */}
      <Card className="border-l-4 border-l-amber">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              This app is not a replacement for professional advice
            </p>
            <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
              FamilyVault helps us organize and track our family&apos;s
              important information. For legal documents, insurance decisions,
              and financial planning, we should always work with qualified
              professionals. The app just makes sure we don&apos;t lose track
              of it all.
            </p>
          </div>
        </div>
      </Card>

      {/* Download resources */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center">
            <FileDown className="w-5 h-5 text-teal" />
          </div>
          Downloadable Resources
        </h2>
        <p className="text-sm text-foreground/70 mb-4">
          This is the guide that inspired this app. It goes deeper into the
          &ldquo;why&rdquo; behind each section if you want to learn more.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="/Family-Emergency-Binder-Template.pdf"
            download
            className="glass card-hover rounded-2xl p-5 flex items-start gap-3 group"
          >
            <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center shrink-0">
              <FileDown className="w-5 h-5 text-navy" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-teal transition">
                Family Emergency Binder Template
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                The original binder template with all 7 tabs. Great for
                understanding what info to gather.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
