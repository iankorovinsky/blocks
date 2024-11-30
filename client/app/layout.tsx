import type { Metadata } from "next";
import "./globals.css";
import { Room } from "./Room";
import { NavbarProvider } from "@/contexts/NavbarContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NodePalette } from "@/components/SidebarNodePallette";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Room>
          <NavbarProvider>
            <SidebarProvider>
              <div className="flex h-screen w-screen">
                <NodePalette />
                <div className="grow overflow-hidden">
                  {children}
                </div>
              </div>
            </SidebarProvider>
          </NavbarProvider>
        </Room>
      </body>
    </html>
  );
}
