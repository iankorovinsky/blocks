'use client';

import { RoomProvider } from "@/liveblocks.config";
import { LiveList } from "@liveblocks/client";
import { ReactNode } from "react";

export function LiveblocksProvider({ children }: { children: ReactNode }) {
  return (
    <RoomProvider 
      id="my-room" 
      initialPresence={{
        cursor: null,
        draggedNode: null,
        lastActive: Date.now()
      }}
      initialStorage={{
        nodes: new LiveList([]),
        edges: new LiveList([]),
        network: "",
        contractName: ""
      }}
    >
      {children}
    </RoomProvider>
  );
} 