'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { useAuth0 } from '@auth0/auth0-react';

export function FlowWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth0();
  const firstName = user?.name?.split(' ')[0] || 'Anonymous';

  return (
    <ReactFlowProvider>
      {children}
    </ReactFlowProvider>
  );
} 