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
    type: "readFunction",
    label: "Read",
    data: { label: "Read", type: "READ", identifier: "" },
    icon: Boxes,
    color: "bg-orange-500",
    description: "Read function node",
  },
  {
    type: "incrementFunction",
    label: "Increment",
    data: { label: "Increment", type: "FUNCTION", identifier: "INCREMENT" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Increment function node",
  },
  {
    type: "decrementFunction",
    label: "Decrement",
    data: { label: "Decrement", type: "FUNCTION", identifier: "DECREMENT" },
    icon: Settings2,
    color: "bg-purple-500",
    description: "Decrement function node",
  },
  {
    type: "assert",
    label: "Assert",
    data: { label: "Assert", type: "CONDITION", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Assert condition",
  },
  {
    type: "isNotZeroCondition",
    label: "Is Not Zero?",
    data: { label: "is_not_zero", type: "CONDITION", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Is Not Zero Condition",
  },
  {
    type: "functionCall",
    label: "Function Call",
    data: { label: "function_call", type: "FUNCTION", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Calls a function and is a parameter",
  },
  {
    type: "getCallerAddress",
    label: "Get Caller Address",
    data: { label: "get_caller_address", type: "FUNCTION", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Gets the address of the caller",
  },
  {
    type: "additionNode",
    label: "Addition",
    data: { label: "Addition", type: "FUNCTION", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Adds two values togethe",
  },
  {
    type: "subtractionNode",
    label: "Subtraction",
    data: { label: "Subtraction", type: "FUNCTION", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Subtracts two values togethe",
  },
  {
    type: "emitNode",
    label: "Emit Event",
    data: { label: "Emit", type: "EVENT", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Emits an event"
  },
  {
    type: "legacyMap",
    label: "LegacyMap",
    data: { label: "LegacyMap", type: "TYPE", identifier: "" },
    icon: Settings2,
    color: "bg-orange-500",
    description: "Dictionary type"
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
