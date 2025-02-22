import { NodePalette } from "@/components/SidebarNodePallette";
import { FlowProviderWrapper } from "@/components/FlowProviderWrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavbarProvider } from "@/contexts/NavbarContext";
import type { Metadata } from "next";
import "./globals.css";
import { Room } from "./Room";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: 'Blocks',
  description: 'Visual Smart Contract Builder',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/favicon.ico' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Room>
            <NavbarProvider>
              <SidebarProvider>
                <FlowProviderWrapper>
                  <div className="flex h-screen w-screen">
                    <NodePalette />
                    <div className="grow overflow-hidden">{children}</div>
                  </div>
                </FlowProviderWrapper>
              </SidebarProvider>
            </NavbarProvider>
          </Room>
        </AuthProvider>
      </body>
    </html>
  );
}
