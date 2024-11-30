"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CuboidIcon as Cube } from "lucide-react";
import { useNavbar } from "@/contexts/NavbarContext";

export function Navbar() {
  const { contractName, setContractName, network, setNetwork } = useNavbar();

  return (
    <nav className="bg-background border-b h-[7vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex-shrink-0 flex items-center">
            <Cube className="h-6 w-6 text-primary mr-2" />
            <span className="text-2xl font-bold text-primary">blocks</span>
          </div>
          <div className="flex items-center space-x-4 flex-grow justify-center">
            <Input
              type="text"
              placeholder="Enter contract name"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="max-w-xs"
            />
            <Select
              value={network}
              onValueChange={(value) =>
                setNetwork(value as "mainnet" | "testnet")
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mainnet">Mainnet</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button>Deploy</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
