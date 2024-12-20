"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  AlertTriangle,
  Ban,
  BookOpen,
  Boxes,
  Code,
  Database,
  FileEdit,
  FileSearch,
  FolderTree,
  List,
  Map,
  Minus,
  MinusSquare,
  Play,
  Plus,
  PlusSquare,
  SendHorizonal,
  UserCircle,
  Variable
} from "lucide-react";
import React from "react";

export interface NodeTemplate {
  type: string;
  data: {
    label: string;
    type: string;
    identifier?: string;
    name?: string;
    storage_variable?: string;
    primitiveType?: string;
    varType?: string;
    variables?: string[];
    storageVar?: string;
    param1?: string;
    param2?: string;
    paramType?: string;
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
    color: "bg-purple-500",
    description: "Storage variable node",
  },
  {
    type: "getFunction",
    data: { label: "Get", type: "FUNCTION", identifier: "GET", name: "" },
    label: "Get",
    icon: FileSearch,
    color: "bg-green-500", 
    description: "Get function node",
  },
  {
    type: "setFunction",
    data: { label: "Set", type: "FUNCTION", identifier: "SET", name: "" },
    label: "Set",
    icon: FileEdit,
    color: "bg-indigo-500",
    description: "Set function node",
  },
  {
    type: "primitive",
    label: "Primitive",
    data: { label: "Primitive", type: "PRIM_TYPE", identifier: "" },
    icon: Variable,
    color: "bg-orange-500",
    description: "Primitive type node",
  },
  {
    type: "compound",
    label: "Compound",
    data: { label: "Compound", type: "COMPOUND_TYPE", identifier: "" },
    icon: Boxes,
    color: "bg-red-500",
    description: "Compound type node",
  },
  {
    type: "readFunction",
    label: "Read",
    data: { label: "Read", type: "READ", identifier: "" },
    icon: BookOpen,
    color: "bg-yellow-500",
    description: "Read function node",
  },
  {
    type: "typedVar",
    label: "Typed Variable",
    data: { 
      label: "Typed Variable", 
      type: "TYPED_VAR",
      name: "",
      varType: "" 
    },
    icon: Variable,
    color: "bg-blue-500",
    description: "Typed variable node",
  },
  {
    type: "write",
    label: "Write",
    data: { 
      label: "Write", 
      type: "WRITE",
      storageVar: "",
      param1: "",
      param2: "" 
    },
    icon: FileEdit,
    color: "bg-purple-500",
    description: "Write function node",
  },
  {
    type: "readWithParam",
    label: "Read With Param",
    data: { 
      label: "Read With Param", 
      type: "READ_PARAM",
      storageVar: "",
      paramType: "" 
    },
    icon: BookOpen,
    color: "bg-green-500",
    description: "Parameterized read node",
  },
  {
    type: "incrementFunction",
    label: "Increment",
    data: { label: "Increment", type: "FUNCTION", identifier: "INCREMENT" },
    icon: PlusSquare,
    color: "bg-indigo-500",
    description: "Increment function node",
  },
  {
    type: "decrementFunction",
    label: "Decrement",
    data: { label: "Decrement", type: "FUNCTION", identifier: "DECREMENT" },
    icon: MinusSquare,
    color: "bg-orange-500",
    description: "Decrement function node",
  },
  {
    type: "assert",
    label: "Assert",
    data: { label: "Assert", type: "CONDITION", identifier: "" },
    icon: AlertTriangle,
    color: "bg-red-500",
    description: "Assert condition",
  },
  {
    type: "isNotZeroCondition",
    label: "Is Not Zero?",
    data: { label: "is_not_zero", type: "CONDITION", identifier: "" },
    icon: Ban,
    color: "bg-yellow-500",
    description: "Is Not Zero Condition",
  },
  {
    type: "functionCall",
    label: "Function Call",
    data: { label: "function_call", type: "FUNCTION", identifier: "" },
    icon: Play,
    color: "bg-blue-500",
    description: "Calls a function and is a parameter",
  },
  {
    type: "getCallerAddress",
    label: "Get Caller Address",
    data: { label: "get_caller_address", type: "FUNCTION", identifier: "" },
    icon: UserCircle,
    color: "bg-purple-500",
    description: "Gets the address of the caller",
  },
  {
    type: "additionNode",
    label: "Addition",
    data: { label: "Addition", type: "FUNCTION", identifier: "" },
    icon: Plus,
    color: "bg-green-500",
    description: "Adds two values togethe",
  },
  {
    type: "subtractionNode",
    label: "Subtraction",
    data: { label: "Subtraction", type: "FUNCTION", identifier: "" },
    icon: Minus,
    color: "bg-indigo-500",
    description: "Subtracts two values togethe",
  },
  {
    type: "emitNode",
    label: "Emit Event",
    data: { label: "Emit", type: "EVENT", identifier: "" },
    icon: SendHorizonal,
    color: "bg-orange-500",
    description: "Emits an event"
  },
  {
    type: "legacyMap",
    label: "LegacyMap",
    data: { label: "LegacyMap", type: "TYPE", identifier: "" },
    icon: Map,
    color: "bg-red-500",
    description: "Dictionary type"
  },
  {
    type: "basicFunction",
    label: "Function",
    data: { label: "Function", type: "FUNCTION", identifier: "" },
    icon: Code,
    color: "bg-yellow-500",
    description: "Defines the start of a function"
  },
  {
    type: "enum",
    label: "Enum",
    data: {
      label: "Enum",
      type: "TYPE",
      name: "",
      variables: []
    },
    icon: List,
    color: "bg-blue-500",
    description: "Enum definition node"
  },
  {
    type: "struct",
    label: "Struct",
    data: {
      label: "Struct",
      type: "TYPE",
      name: "",
      variables: []
    },
    icon: FolderTree,
    color: "bg-purple-500",
    description: "Struct definition node"
  },
  {
    type: "writeWithParams",
    label: "Write With Parameters",
    data: {
      label: "Write With Parameters",
      type: "FUNCTION",
      storageVar: "",
      param1: "",
      param2: ""
    },
    icon: FileEdit,
    color: "bg-green-500",
    description: "Write with parameters node"
  },
  {
    type: "readWithParams",
    label: "Read With Parameters",
    data: {
      label: "Read With Parameters",
      type: "FUNCTION",
      storageVar: "",
      paramType: ""
    },
    icon: BookOpen,
    color: "bg-indigo-500",
    description: "Read with parameters node"
  }
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
