"use client";

import * as React from "react";
import { PanelLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";

type SidebarContext = {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <SidebarContext.Provider 
      value={{ 
        isCollapsed, 
        setIsCollapsed, 
        isMobile,
        searchQuery,
        setSearchQuery,
        isSearchFocused,
        setIsSearchFocused
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function Sidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  const { isCollapsed, isMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet>
        <SheetContent side="left" className="w-[--sidebar-width-mobile] p-0">
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "group/sidebar flex min-h-svh",
        isCollapsed ? "w-[--sidebar-width-icon]" : "w-[--sidebar-width]",
        "transition-all duration-300 ease-in-out bg-sidebar",
        className
      )}
      style={{
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
      } as React.CSSProperties}
    >
      <div className="flex h-full w-full flex-col text-sidebar-foreground">
        {children}
      </div>
    </div>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex h-[7vh] items-center border-b px-4", className)}
      {...props}
    />
  );
}

function SidebarSearch() {
  const { searchQuery, setSearchQuery, isSearchFocused, setIsSearchFocused } = useSidebar();
  
  return (
    <div className="relative mb-4 px-4 pt-4">
      <Input
        type="text"
        placeholder="Search blocks..."
        className="pl-10 w-full bg-background border-input rounded-md text-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
      />
      <Search className="absolute left-7 top-[2.125rem] -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  const { isCollapsed } = useSidebar();
  
  return (
    <ScrollArea className="h-[calc(100vh-7vh)]">
      <div
        className={cn(
          "flex-1",
          isCollapsed ? "px-2" : "px-4",
          className
        )}
        {...props}
      />
    </ScrollArea>
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 py-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div
      className={cn(
        "text-xs font-medium text-muted-foreground",
        isCollapsed ? "sr-only" : "px-2",
        className
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

function SidebarTrigger() {
  const { setIsCollapsed, isCollapsed } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <PanelLeft className={cn("h-4 w-4", isCollapsed && "rotate-180")} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <Separator
      className={cn("-mx-4 bg-border", className)}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarSearch,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
