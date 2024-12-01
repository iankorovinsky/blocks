'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { Cursor } from './Cursor';
import { useOthers } from '@liveblocks/react/suspense';
import { useAuth0 } from '@auth0/auth0-react';

export function FlowWrapper({ children }: { children: React.ReactNode }) {
  const others = useOthers();
  const { user } = useAuth0();
  const firstName = user?.name?.split(' ')[0] || 'Anonymous';

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
            name={firstName}
          />
        );
      })}
      {children}
    </ReactFlowProvider>
  );
} 