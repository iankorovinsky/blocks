// Define Liveblocks types for your application

import { LiveList, LiveObject, JsonObject } from "@liveblocks/client";
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Node, Edge } from "@xyflow/react";

const client = createClient({
  publicApiKey: "your_public_key_here",
});

// Presence represents the cursor position
type Presence = {
  cursor: { x: number; y: number } | null;
  draggedNode: { id: string; position: { x: number; y: number } } | null;
};

// Serializable versions of Node and Edge
type SerializedNode = JsonObject & {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
};

type SerializedEdge = JsonObject & {
  id: string;
  source: string;
  target: string;
  type?: string;
};

// Storage represents the persistent data
type Storage = {
  nodes: LiveList<SerializedNode>;
  edges: LiveList<SerializedEdge>;
};

export const {
  RoomProvider,
  useMyPresence,
  useStorage,
  useMutation,
  useOthers,
  /* ...other hooks... */
} = createRoomContext<Presence, Storage>(client);
