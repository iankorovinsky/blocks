'use client';

import { RoomProvider } from "@/liveblocks.config";
import { ReactNode } from "react";

export function LiveblocksProvider({ children }: { children: ReactNode }) {
  return (
    <RoomProvider id="my-room" initialPresence={{
      cursor: null,
      draggedNode: null,
      lastActive: Date.now()
    }}>
      {children}
    </RoomProvider>
  );
} 