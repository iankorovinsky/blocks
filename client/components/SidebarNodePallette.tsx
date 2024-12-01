"use client";

import React from "react";
import {
  Database,
  Settings2,
  Hash,
  Boxes,
  ArrowDownCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";

export interface NodeTemplate {
  type: string;
  data: {
    label: string;
    type: string;
    identifier?: string;
    name?: string;
    storage_variable?: string;
    primitiveType?: string;
  };
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: "storage",
    label: "Storage",
    data: {
      label: "Storage",
      type: "STORAGE_VAR",
      identifier: "",
      storage_variable: "",
    },
    icon: Database,
    color: "bg-blue-500",
    description: "Storage variable node",
  },
  {
    type: "getFunction",
    data: { label: "Get", type: "FUNCTION", identifier: "GET", name: "" },
    label: "Get",
    icon: ArrowDownCircle,
    color: "bg-orange-500",
    description: "Get function node",
  },
  {
    type: "setFunction",
    data: { label: "Set", type: "FUNCTION", identifier: "SET", name: "" },
    label: "Set",
    icon: Settings2,
    color: "bg-orange-500",
    description: "Set function node",
  },
  {
    type: "primitive",
    label: "Primitive",
    data: { label: "Primitive", type: "PRIM_TYPE", identifier: "" },
    icon: Hash,
    color: "bg-purple-500",
    description: "Primitive type node",
  },
  {
    type: "compound",
    label: "Compound",
    data: { label: "Compound", type: "COMPOUND_TYPE", identifier: "" },
    icon: Boxes,
    color: "bg-purple-500",
    description: "Compound type node",
  },
  {
    type: "basicFunction",
    label: "Basic Function",
    data: { label: "Basic Function", type: "FUNCTION", identifier: "BASIC" },
    icon: ArrowDownCircle,
    color: "bg-orange-500",
    description: "Basic function node",
  },
  {
    type: "readFunction",
    label: "Read",
    data: { label: "Read", type: "READ", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Read function node",
  },
  {
    type: "incrementFunction",
    label: "Increment",
    data: { label: "Increment", type: "FUNCTION", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Increment function node",
  },
  {
    type: "decrementFunction",
    label: "Decrement",
    data: { label: "Decrement", type: "FUNCTION", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Decrement function node",
  },
];

export function NodePalette() {
  const onDragStart = (
    event: React.DragEvent,
    nodeInformation: NodeTemplate,
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeInformation),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Sidebar className="w-64 border-r border-border">
      <SidebarHeader className="h-[7vh] border-b flex items-center px-4">
        <h2 className="text-lg font-semibold">Nodes</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Available Blocks</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid gap-2 p-2">
              {nodeTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.type}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border cursor-move hover:bg-accent transition-colors"
                    draggable
                    onDragStart={(e) => onDragStart(e, template)}
                  >
                    <div className={`p-2 rounded ${template.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{template.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
