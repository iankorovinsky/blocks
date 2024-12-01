'use client';

import { FlowProvider } from "@/contexts/FlowContext";
import { ReactNode } from "react";

export function FlowProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <FlowProvider value={{ localNodes: [], localEdges: [] }}>
      {children}
    </FlowProvider>
  );
} 