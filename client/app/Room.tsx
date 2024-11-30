"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_prod_hxsifK11dNff7o_wuiZQx9FH2z5jvTZmS09I6wFNacLK924Rwh0gvA1WL3s6mldT"
      }
      throttle={16}
    >
      <RoomProvider initialPresence={{ cursor: null }} id="my-room">
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
