"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  BookOpen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

const navigation = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "New chat", href: "/dashboard/chat", icon: MessageSquare },
  { title: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];




type AppSidebarProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};


export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex items-center justify-between px-2 py-1.5'>
          <Link href='/dashboard' className='flex items-center gap-2'>
            <span className='flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground'>
              k
            </span>
            <span className='text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden'>
              kaabe
            </span>
          </Link>
          <SidebarTrigger className='group-data-[collapsible=icon]:hidden' />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <Link className='flex gap-2' href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className='flex gap-2'>
                  <span className='ml-2'>Chats</span>
                  {/* <ul className="flex flex-col gap-2 ">
                        {conversations.map(conversation => (
                        <li className="text-gray-200" key={conversation.id}>{conversation.title}</li>
                        ))}
                      </ul> */}
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground'>
                    {user.name.charAt(0).toUpperCase()}
                  </span>

                  <span className='flex flex-1 flex-col items-start truncate group-data-[collapsible=icon]:hidden'>
                    <span className='truncate text-sm font-medium'>
                      {user.name}
                    </span>
                    <span className='truncate text-xs text-sidebar-foreground/60'>
                      {user.email}
                    </span>
                  </span>

                  <ChevronsUpDown className='ml-auto size-4 text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side='top' align='start' className='w-56'>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/sign-in";
                  }}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
