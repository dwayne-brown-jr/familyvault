"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Menu,
  X,
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

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 glass-nav border-b border-border sticky top-0 z-40 safe-area-pt">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg accent-soft">
            <Shield className="w-4.5 h-4.5 text-teal" />
          </div>
          <span className="font-bold text-gradient">FamilyVault</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-white/[0.06] transition text-foreground"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-72 glass-nav border-l border-border p-4 space-y-1 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg accent-soft">
                  <Shield className="w-4.5 h-4.5 text-teal" />
                </div>
                <span className="font-bold text-gradient">FamilyVault</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                    isActive
                      ? "accent-soft text-teal"
                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-border mt-4 pt-4 space-y-1">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground transition w-full"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground transition w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
