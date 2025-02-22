"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList } from "@liveblocks/client";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={
        process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY as string
      }
      throttle={16}
    >
      <RoomProvider initialStorage={{ nodeData: new LiveList([]), edgeData: new LiveList([]), network: "", contractName: "" }} initialPresence={{ cursor: null }} id="my-room">
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
