"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-teal" />
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}

function JoinContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "ready" | "joining" | "success" | "error" | "invalid">("loading");
  const [invite, setInvite] = useState<{ email: string; household_name: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    async function checkInvite() {
      const supabase = createClient();
      // Look up the invite on the server. The invitee isn't in the household yet,
      // so they can't read household_invites directly.
      const { data, error: err } = await supabase.rpc("get_household_invite", {
        p_token: token,
      });
      const inv = Array.isArray(data) ? data[0] : null;

      if (err || !inv) {
        setStatus("invalid");
        return;
      }

      if (!inv.is_valid) {
        setStatus("invalid");
        setError("This invite has expired or was already used.");
        return;
      }

      setInvite({
        email: inv.email,
        household_name: inv.household_name || "Family",
      });
      setStatus("ready");
    }

    checkInvite();
  }, [token]);

  const acceptInvite = async () => {
    setStatus("joining");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in — redirect to login with return URL
        window.location.href = `/login?redirect=${encodeURIComponent(`/join?token=${token}`)}`;
        return;
      }

      // Joining happens on the server: it checks the token, expiry and that the
      // signed-in email matches the invited email, then moves this user's data.
      const { error: joinErr } = await supabase.rpc("accept_household_invite", {
        p_token: token,
      });

      if (joinErr) {
        setStatus("error");
        setError(joinErr.message || "Invite not found or already used.");
        return;
      }

      setStatus("success");
    } catch (err) {
      console.error("Error accepting invite:", err);
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full glass glow-accent rounded-2xl p-8 text-center">
        <span className="w-12 h-12 rounded-xl accent-soft flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-teal" />
        </span>
        <h1 className="text-2xl font-bold text-gradient tracking-tight mb-2">FamilyVault</h1>

        {status === "loading" && (
          <div className="py-8">
            <Loader2 className="w-8 h-8 animate-spin text-teal mx-auto" />
            <p className="text-muted-foreground mt-3">Checking invite...</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="py-8">
            <XCircle className="w-12 h-12 text-coral mx-auto mb-3" />
            <p className="text-foreground font-medium">Invalid or Expired Invite</p>
            <p className="text-muted-foreground text-sm mt-2">
              {error || "This invite link is no longer valid. Ask your family member to send a new one."}
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 bg-teal text-[#08090D] rounded-lg px-4 py-2.5 font-medium hover:bg-teal-light transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "ready" && invite && (
          <div className="py-6">
            <p className="text-muted-foreground mb-1">You&apos;ve been invited to join</p>
            <p className="text-xl font-bold text-teal mb-6">{invite.household_name}</p>
            <p className="text-muted-foreground text-sm mb-6">
              Once you join, you&apos;ll share all financial data with this household.
              Any data you&apos;ve already added will be merged in.
            </p>
            <button
              onClick={acceptInvite}
              className="w-full bg-teal text-[#08090D] rounded-lg px-4 py-3 font-medium hover:bg-teal-light transition"
            >
              Accept & Join Household
            </button>
          </div>
        )}

        {status === "joining" && (
          <div className="py-8">
            <Loader2 className="w-8 h-8 animate-spin text-teal mx-auto" />
            <p className="text-muted-foreground mt-3">Joining household...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-8">
            <CheckCircle className="w-12 h-12 text-teal mx-auto mb-3" />
            <p className="text-foreground font-medium">Welcome to the family!</p>
            <p className="text-muted-foreground text-sm mt-2">
              You now share all data with your household.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 bg-teal text-[#08090D] rounded-lg px-4 py-3 font-medium hover:bg-teal-light transition"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="py-8">
            <XCircle className="w-12 h-12 text-coral mx-auto mb-3" />
            <p className="text-foreground font-medium">Error</p>
            <p className="text-muted-foreground text-sm mt-2">{error}</p>
            <button
              onClick={() => setStatus("ready")}
              className="inline-block mt-4 bg-teal text-[#08090D] rounded-lg px-4 py-2.5 font-medium hover:bg-teal-light transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
