"use client";

import { Node, Edge } from "@xyflow/react";
import { createContext, useContext } from "react";

interface FlowContextType {
  localNodes: Node[];
  localEdges: Edge[];
}

const FlowContext = createContext<FlowContextType | null>(null);

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) throw new Error("useFlow must be used within FlowProvider");
  return context;
};

export const FlowProvider = FlowContext.Provider; 