'use client';

import dynamic from 'next/dynamic';

const Flow = dynamic(() => import('./Flow'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export function FlowWrapper() {
  return <Flow />;
} 