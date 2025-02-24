'use client';

import { Auth0Provider } from '@auth0/auth0-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-xffaaa5fk8wi8c8m.us.auth0.com/api/v2/'
      }}
    >
      {children}
    </Auth0Provider>
  );
} 