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
import { Edge, Node as FlowNode } from "@xyflow/react";
import { useAuth0 } from '@auth0/auth0-react';
import { useStorage } from "@liveblocks/react/suspense";
import { LiveList } from "@liveblocks/client";
import type { SerializedNode, SerializedEdge } from '../liveblocks.config';
import axios from 'axios';


export function Navbar() {
  const { contractName, setContractName, network, setNetwork } = useNavbar();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const nodes = useStorage((root) => root.nodes);
  const edges = useStorage((root) => root.edges);

  const handleDeploy = () => {
    const actualNodes = nodes ? Array.from(nodes as unknown as LiveList<SerializedNode>) : [];
    const actualEdges = edges ? Array.from(edges as unknown as LiveList<SerializedEdge>) : [];

    const deploymentData = {
      nodeData: actualNodes,
      edgeData: actualEdges,
      contractName,
      network,
    };

    window.alert("Deploying contract with data: " + JSON.stringify(deploymentData, null, 2));
    console.log("Deploying contract with data: ", deploymentData);

    axios.post("https://apt-polished-raptor.ngrok-free.app/deploy", deploymentData)
      .then(response => {
        const hash = response.data.hash;
        console.log("Deployment hash: ", hash);
        window.open(`https://sepolia.starkscan.co/contract/${hash}`, "_blank");
      })
      .catch(error => {
        console.error("Error deploying contract: ", error);
      });
  };

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
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{user?.email}</span>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => loginWithRedirect()}>Login</Button>
            )}
            <Button onClick={handleDeploy}>Deploy</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
