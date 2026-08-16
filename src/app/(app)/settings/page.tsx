"use client";

import { useState } from "react";
import { useHousehold, useProfile } from "@/lib/hooks/use-data";
import { Settings, Users, Mail, Trash2, Copy, Check, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { household, members, invites, loading, sendInvite, revokeInvite } = useHousehold();
  const { monthlyIncome, loading: profileLoading } = useProfile();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSuccess("");
    setSending(true);
    try {
      const invite = await sendInvite(email.trim());
      setSuccess(`Invite created! Share this link with ${email}:`);
      setEmail("");
      // Copy invite link
      const link = `${window.location.origin}/join?token=${invite.token}`;
      await navigator.clipboard.writeText(link);
      setCopied(invite.id);
      setTimeout(() => setCopied(null), 3000);
    } catch (err) {
      setError("Failed to create invite. Make sure the email is valid.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const copyInviteLink = async (invite: { id: string; token: string }) => {
    const link = `${window.location.origin}/join?token=${invite.token}`;
    await navigator.clipboard.writeText(link);
    setCopied(invite.id);
    setTimeout(() => setCopied(null), 3000);
  };

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7 text-teal" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your household and account
        </p>
      </div>

      {/* Household Info */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center">
            <Users className="w-5 h-5 text-teal" />
          </div>
          Household
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Household Name
            </label>
            <p className="text-foreground font-medium">{household?.name || "My Family"}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Members
            </label>
            <div className="mt-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                >
                  <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center text-teal font-semibold text-sm">
                    {(m.display_name || "?")[0].toUpperCase()}
                  </div>
                  <span className="text-foreground">{m.display_name || "Unknown"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center">
            <Mail className="w-5 h-5 text-teal" />
          </div>
          Invite a Family Member
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Send an invite link so your spouse or partner can join your household and see all the same data.
        </p>

        <form onSubmit={handleInvite} className="flex gap-2">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
          <button
            type="submit"
            disabled={sending || !email.trim()}
            className="px-4 py-2 bg-teal text-[#08090D] rounded-lg font-medium hover:bg-teal-light transition disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite"}
          </button>
        </form>

        {error && <p className="text-coral text-sm mt-2">{error}</p>}
        {success && <p className="text-teal text-sm mt-2">{success}</p>}

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              Pending Invites
            </h3>
            <div>
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full accent-soft flex items-center justify-center text-teal font-semibold text-sm shrink-0">
                      {(inv.email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-foreground text-sm">{inv.email}</span>
                      <span className="text-muted-foreground text-xs ml-2">
                        expires {new Date(inv.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyInviteLink(inv)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.08] transition"
                      title="Copy invite link"
                    >
                      {copied === inv.id ? (
                        <Check className="w-4 h-4 text-teal" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => revokeInvite(inv.id)}
                      className="p-1.5 rounded-lg text-coral hover:bg-coral/15 transition"
                      title="Revoke invite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Account</h2>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Monthly Take-Home Income
          </label>
          <p className="text-foreground font-medium">
            ${monthlyIncome.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
