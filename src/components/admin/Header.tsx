"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "./Sidebar";
import { signOut } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  
  // Extract page title from path
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return "Dashboard";
    
    const lastSegment = segments[segments.length - 1];
    // Handle dynamic routes (e.g. [id]) or 'new'
    if (lastSegment === 'new') return `Create ${segments[segments.length - 2].slice(0, -1)}`;
    if (segments[segments.length - 2] === 'edit') return `Edit ${segments[segments.length - 3].slice(0, -1)}`;
    
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <MobileSidebar />
      
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl hidden md:block">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold border border-indigo-200">
                <User className="h-4 w-4" />
              </div>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/admin/login" })} className="text-red-600">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
