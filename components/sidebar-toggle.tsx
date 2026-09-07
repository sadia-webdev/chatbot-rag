// components/sidebar-toggle.tsx
"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarToggle({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type='button'
      onClick={toggleSidebar}
      aria-label='Toggle sidebar'
      className={cn(
        "fixed left-4  top-2 z-40 flex size-9 items-center justify-center rounded-lg bg-accent text-white shadow-md",
        "md:hidden",
        className,
      )}
    >
      <Menu className='size-5' />
    </button>
  );
}
