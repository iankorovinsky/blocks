// Define Liveblocks types for your application

import { LiveList, LiveObject, JsonObject } from "@liveblocks/client";
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Node, Edge } from "@xyflow/react";

const client = createClient({
  publicApiKey: "your_public_key_here",
});

// Presence represents the cursor position and dragged node state
export type Presence = {
  cursor: { 
    x: number;       // Absolute screen position
    y: number;       // Absolute screen position
    flowX: number;   // Flow-relative position
    flowY: number;   // Flow-relative position
  } | null;
  draggedNode: { id: string; position: { x: number; y: number } } | null;
  lastActive: number;
};

// Serializable versions of Node and Edge
export type SerializedNode = JsonObject & {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
};

export type SerializedEdge = JsonObject & {
  id: string;
  source: string;
  target: string;
  type?: string;
};

// Storage represents the persistent data
type Storage = {
  nodes: LiveList<SerializedNode>;
  edges: LiveList<SerializedEdge>;
  network: string;
  contractName: string;
};

export const {
  RoomProvider,
  useMyPresence,
  useStorage,
  useMutation,
  useOthers,
} = createRoomContext<Presence, Storage>(client);
