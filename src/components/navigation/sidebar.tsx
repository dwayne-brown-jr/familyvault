"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  FolderLock,
  ListChecks,
  GraduationCap,
  ShieldCheck,
  Settings,
  BookOpen,
  Sparkles,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "Vault Assistant", icon: Sparkles },
  { href: "/binder", label: "Emergency Binder", icon: FolderLock },
  { href: "/action-plan", label: "Action Plan", icon: ListChecks },
  { href: "/529", label: "529 Calculator", icon: GraduationCap },
  { href: "/insurance", label: "Insurance Gap", icon: ShieldCheck },
  { href: "/guide", label: "Guide", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-nav border-r border-border min-h-screen sticky top-0 h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl accent-soft glow-accent">
          <Shield className="w-5 h-5 text-teal" />
        </div>
        <span className="text-lg font-bold tracking-tight text-gradient">FamilyVault</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "accent-soft text-teal glow-accent"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition w-full"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
