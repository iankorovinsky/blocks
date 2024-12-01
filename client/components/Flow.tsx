"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useOthers, useMyPresence, useStorage, useRoom, useMutation } from "@liveblocks/react";
import { Cursor } from "./Cursor";
import { TNode } from "@/liveblocks.config";
import { NodeTemplate } from "./SidebarNodePallette";
import { useNavbar } from "@/contexts/NavbarContext";
import { Navbar } from "./Navbar";
import AISearch from "./AIAgentSearchbar";
import { ChatBot } from "./Chatbot";
import { LiveObject } from "@liveblocks/client";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../app/types/node";
import axios from "axios";

type TEdge = Edge;

interface Presence {
  cursor: { x: number; y: number } | null;
}

// Copy the rest of your Flow component logic here...
export default function Flow() {
  // Your existing component logic...
} 