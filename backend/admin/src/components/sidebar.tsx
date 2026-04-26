"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Users, PhoneCall, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/health", label: "Health", icon: Activity },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/vapi", label: "Vapi Simulator", icon: PhoneCall },
  { href: "/end-of-call", label: "End-of-Call", icon: PhoneOff },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r border-border bg-card flex flex-col">
      <div className="px-6 py-5 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Care Passport</span>
        <span className="block text-xs text-muted-foreground">Admin</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
