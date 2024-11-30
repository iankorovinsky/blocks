"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Network = 'mainnet' | 'testnet';

interface NavbarContextType {
  contractName: string;
  setContractName: (name: string) => void;
  network: Network;
  setNetwork: (network: Network) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [contractName, setContractName] = useState('');
  const [network, setNetwork] = useState<Network>('testnet');

  return (
    <NavbarContext.Provider value={{ contractName, setContractName, network, setNetwork }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}

