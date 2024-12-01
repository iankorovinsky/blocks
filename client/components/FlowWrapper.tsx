'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { Cursor } from './Cursor';
import { useOthers } from '@liveblocks/react/suspense';

export function FlowWrapper({ children }: { children: React.ReactNode }) {
  const others = useOthers();

  return (
    <ReactFlowProvider>
      {others.map(({ connectionId, presence }) => {
        if (!presence.cursor) return null;
        return (
          <Cursor
            key={connectionId}
            x={(presence.cursor as { x: number }).x}
            y={(presence.cursor as { y: number }).y}
            lastActive={presence.lastActive as number}
          />
        );
      })}
      {children}
    </ReactFlowProvider>
  );
} 