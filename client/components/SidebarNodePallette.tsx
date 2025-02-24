"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSearch,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertTriangle,
  Ban,
  BookOpen,
  Boxes,
  Code,
  Code2,
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
  Variable,
  Filter
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export enum NodeCategory {
  VARIABLES = "Variables",
  FUNCTIONS = "Functions",
  ADVANCED = "Advanced"
}

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
    code?: string;
  };
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  category: NodeCategory;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: "constructor",
    label: "Constructor",
    data: { label: "Constructor", type: "FUNCTION", identifier: "CONSTRUCTOR" },
    icon: Code,
    color: "bg-pink-500",
    description: "Constructor function node",
    category: NodeCategory.ADVANCED
  },
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
    category: NodeCategory.VARIABLES
  },
  {
    type: "primitive",
    label: "Primitive",
    data: { label: "Primitive", type: "PRIM_TYPE", identifier: "" },
    icon: Variable,
    color: "bg-purple-500",
    description: "Primitive type node",
    category: NodeCategory.VARIABLES
  },
  {
    type: "typedVariable",
    label: "Typed Variable",
    data: { 
      label: "Typed Variable", 
      type: "TYPED_VAR",
      name: "",
      varType: "" 
    },
    icon: Variable,
    color: "bg-green-500",
    description: "Typed variable node",
    category: NodeCategory.VARIABLES
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
    color: "bg-blue-500",
    description: "Struct definition node",
    category: NodeCategory.VARIABLES
  },
  {
    type: "basicFunction",
    label: "Function",
    data: { label: "Function", type: "FUNCTION", identifier: "FUNCTION" },
    icon: Code,
    color: "bg-pink-500",
    description: "Defines the start of a function",
    category: NodeCategory.ADVANCED
  },
  {
    type: "eventNode",
    label: "Event",
    data: { label: "Event", type: "EVENT", identifier: "" },
    icon: SendHorizonal,
    color: "bg-pink-500",
    description: "Emits an event",
    category: NodeCategory.ADVANCED
  },
  {
    type: "code",
    label: "Code",
    data: { label: "Code", type: "CODE", code: "" },
    icon: Code,
    color: "bg-pink-500",
    description: "Code editor node",
    category: NodeCategory.ADVANCED
  },
  {
    type: "getFunction",
    data: { label: "Get", type: "FUNCTION", identifier: "GET", name: "" },
    label: "Get",
    icon: FileSearch,
    color: "bg-orange-500", 
    description: "Get function node",
    category: NodeCategory.FUNCTIONS
  },
  {
    type: "setFunction",
    data: { label: "Set", type: "FUNCTION", identifier: "SET", name: "" },
    label: "Set",
    icon: FileEdit,
    color: "bg-orange-500",
    description: "Set function node",
    category: NodeCategory.FUNCTIONS
  },
  
  // {
  //   type: "compound",
  //   label: "Compound",
  //   data: { label: "Compound", type: "COMPOUND_TYPE", identifier: "" },
  //   icon: Boxes,
  //   color: "bg-red-500",
  //   description: "Compound type node",
  //   category: NodeCategory.VARIABLES
  // },
  // {
  //   type: "readFunction",
  //   label: "Read",
  //   data: { label: "Read", type: "READ", identifier: "" },
  //   icon: BookOpen,
  //   color: "bg-yellow-500",
  //   description: "Read function node",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "write",
  //   label: "Write",
  //   data: { 
  //     label: "Write", 
  //     type: "WRITE",
  //     storageVar: "",
  //     param1: "",
  //     param2: "" 
  //   },
  //   icon: FileEdit,
  //   color: "bg-purple-500",
  //   description: "Write function node",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "readWithParam",
  //   label: "Read With Param",
  //   data: { 
  //     label: "Read With Param", 
  //     type: "READ_PARAM",
  //     storageVar: "",
  //     paramType: "" 
  //   },
  //   icon: BookOpen,
  //   color: "bg-green-500",
  //   description: "Parameterized read node",
  //   category: NodeCategory.FUNCTIONS
  // },
  {
    type: "incrementFunction",
    label: "Increment",
    data: { label: "Increment", type: "FUNCTION", identifier: "INCREMENT" },
    icon: PlusSquare,
    color: "bg-orange-500",
    description: "Increment function node",
    category: NodeCategory.FUNCTIONS
  },
  {
    type: "decrementFunction",
    label: "Decrement",
    data: { label: "Decrement", type: "FUNCTION", identifier: "DECREMENT" },
    icon: MinusSquare,
    color: "bg-orange-500",
    description: "Decrement function node",
    category: NodeCategory.FUNCTIONS
  },
  // {
  //   type: "assert",
  //   label: "Assert",
  //   data: { label: "Assert", type: "CONDITION", identifier: "" },
  //   icon: AlertTriangle,
  //   color: "bg-red-500",
  //   description: "Assert condition",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "isNotZeroCondition",
  //   label: "Is Not Zero?",
  //   data: { label: "is_not_zero", type: "CONDITION", identifier: "" },
  //   icon: Ban,
  //   color: "bg-yellow-500",
  //   description: "Is Not Zero Condition",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "functionCall",
  //   label: "Function Call",
  //   data: { label: "function_call", type: "FUNCTION", identifier: "" },
  //   icon: Play,
  //   color: "bg-blue-500",
  //   description: "Calls a function and is a parameter",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "getCallerAddress",
  //   label: "Get Caller Address",
  //   data: { label: "get_caller_address", type: "FUNCTION", identifier: "" },
  //   icon: UserCircle,
  //   color: "bg-purple-500",
  //   description: "Gets the address of the caller",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "additionNode",
  //   label: "Addition",
  //   data: { label: "Addition", type: "FUNCTION", identifier: "" },
  //   icon: Plus,
  //   color: "bg-green-500",
  //   description: "Adds two values together",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "subtractionNode",
  //   label: "Subtraction",
  //   data: { label: "Subtraction", type: "FUNCTION", identifier: "" },
  //   icon: Minus,
  //   color: "bg-indigo-500",
  //   description: "Subtracts two values together",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "defineEventNode",
  //   label: "Define Event",
  //   data: { label: "DefineEvent", type: "EVENT", identifier: "" },
  //   icon: SendHorizonal,
  //   color: "bg-orange-500",
  //   description: "Defines an event",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "legacyMap",
  //   label: "LegacyMap",
  //   data: { label: "LegacyMap", type: "TYPE", identifier: "" },
  //   icon: Map,
  //   color: "bg-red-500",
  //   description: "Dictionary type",
  //   category: NodeCategory.VARIABLES
  // },
  // {
  //   type: "enum",
  //   label: "Enum",
  //   data: {
  //     label: "Enum",
  //     type: "TYPE",
  //     name: "",
  //     variables: []
  //   },
  //   icon: List,
  //   color: "bg-blue-500",
  //   description: "Enum definition node",
  //   category: NodeCategory.VARIABLES
  // },
  // {
  //   type: "writeWithParams",
  //   label: "Write With Parameters",
  //   data: {
  //     label: "Write With Parameters",
  //     type: "FUNCTION",
  //     storageVar: "",
  //     param1: "",
  //     param2: ""
  //   },
  //   icon: FileEdit,
  //   color: "bg-green-500",
  //   description: "Write with parameters node",
  //   category: NodeCategory.FUNCTIONS
  // },
  // {
  //   type: "readWithParams",
  //   label: "Read With Parameters",
  //   data: {
  //     label: "Read With Parameters",
  //     type: "FUNCTION",
  //     storageVar: "",
  //     paramType: ""
  //   },
  //   icon: BookOpen,
  //   color: "bg-indigo-500",
  //   description: "Read with parameters node",
  //   category: NodeCategory.FUNCTIONS
  // }
];

export function NodePalette() {
  const { searchQuery, isSearchFocused } = useSidebar();
  const [selectedCategory, setSelectedCategory] = React.useState<NodeCategory | "ALL">("ALL");

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

  const filteredNodes = React.useMemo(() => {
    let nodes = nodeTemplates;

    // Apply category filter
    if (selectedCategory !== "ALL") {
      nodes = nodes.filter((node) => node.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter(
        (node) =>
          node.label.toLowerCase().includes(query) ||
          node.description.toLowerCase().includes(query) ||
          node.type.toLowerCase().includes(query)
      );
    }

    return nodes;
  }, [searchQuery, selectedCategory]);

  return (
    <Sidebar className="w-64 border-r border-border">
      <SidebarHeader className="h-[7vh] border-b flex items-center justify-center px-4">
        <h2 className="text-lg font-semibold">Nodes</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSearch />
        <div className="p-2 border-b">
          <select 
            className="w-full p-2 rounded-md bg-background border border-border"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as NodeCategory | "ALL")}
          >
            <option value="ALL">All Categories</option>
            {Object.values(NodeCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Available Blocks</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid gap-2 p-2">
              {filteredNodes.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.type}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg bg-card border border-border cursor-move transition-colors",
                      isSearchFocused &&
                      searchQuery &&
                      template.label.toLowerCase().includes(searchQuery.toLowerCase())
                        ? "bg-blue-500/20 scale-102"
                        : "hover:bg-accent"
                    )}
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
