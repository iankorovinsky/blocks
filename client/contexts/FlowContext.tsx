"use client";

import { Node, Edge } from "@xyflow/react";
import { createContext, useContext, useState } from "react";

interface FlowContextType {
  localNodes: Node[];
  localEdges: Edge[];
  setLocalNodes: (nodes: Node[]) => void;
  setLocalEdges: (edges: Edge[]) => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) throw new Error("useFlow must be used within FlowProvider");
  return context;
};

interface FlowProviderProps {
  children: React.ReactNode;
}

export function FlowProvider({ children }: FlowProviderProps) {
  const [localNodes, setLocalNodes] = useState<Node[]>([]);
  const [localEdges, setLocalEdges] = useState<Edge[]>([]);

  return (
    <FlowContext.Provider value={{ localNodes, localEdges, setLocalNodes, setLocalEdges }}>
      {children}
    </FlowContext.Provider>
  );
} 