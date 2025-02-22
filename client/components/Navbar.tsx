"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavbar } from "@/contexts/NavbarContext";
import { useAuth0 } from '@auth0/auth0-react';
import { LiveList } from "@liveblocks/client";
import { useStorage } from "@liveblocks/react/suspense";
import axios from 'axios';
import { CuboidIcon as Cube } from "lucide-react";
import type { SerializedEdge, SerializedNode } from '../liveblocks.config';
import { useState } from "react";
import { CollaborativeEditor } from "./CollaborativeEditor";


export function Navbar() {
  const { contractName, setContractName, network, setNetwork } = useNavbar();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const nodes = useStorage((root) => root.nodes);
  const edges = useStorage((root) => root.edges);
  const [showEditor, setShowEditor] = useState(false);
  const [compiledCode, setCompiledCode] = useState("");

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

    axios.post("http://127.0.0.1:5000/deploy", deploymentData)
      .then(response => {
        const hash = response.data.hash;
        console.log("Deployment hash: ", hash);
        window.open(`https://sepolia.starkscan.co/contract/${hash}`, "_blank");
      })
      .catch(error => {
        console.error("Error deploying contract: ", error);
      });
  };

  const handleCompile = () => {
    const actualNodes = nodes ? Array.from(nodes as unknown as LiveList<SerializedNode>) : [];
    const actualEdges = edges ? Array.from(edges as unknown as LiveList<SerializedEdge>) : [];

    const compilationData = {
      nodeData: actualNodes,
      edgeData: actualEdges,
      contractName,
    };

    console.log("Compiling contract with data: ", compilationData);

    axios.post("http://127.0.0.1:5000/compile", compilationData)
      .then(response => {
        const code = response.data.code;
        setCompiledCode(code);
        setShowEditor(true);
      })
      .catch(error => {
        console.error("Error compiling contract: ", error);
        setCompiledCode("// Error compiling contract");
        setShowEditor(true);
      });
  };

  return (
    <>
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
              <Button onClick={handleCompile}>
                Compile
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-[80vw] h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Contract Code</h2>
              <Button variant="ghost" onClick={() => setShowEditor(false)}>
                Close
              </Button>
            </div>
            <div className="flex-1">
              <CollaborativeEditor initialValue={compiledCode} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
