"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        const params = new URLSearchParams(window.location.search);
        const next = params.get("redirect");
        // Only same-site paths, never another domain.
        const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
        router.push(dest);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-10 h-10 rounded-xl accent-soft flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal" />
            </span>
            <span className="text-2xl font-bold text-gradient tracking-tight">FamilyVault</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="glass glow-accent rounded-2xl p-6 space-y-4">
          {error && (
            <div className="glass rounded-lg p-3 border-coral/30 bg-coral/[0.08] text-coral text-sm">{error}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-[#08090D] font-medium rounded-lg py-2.5 hover:bg-teal-light transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            onClick={(e) => {
              // Keep ?redirect= so an invited person lands back on their invite after signing up.
              e.preventDefault();
              window.location.href = "/signup" + window.location.search;
            }}
            className="text-teal hover:text-teal-light font-medium transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
