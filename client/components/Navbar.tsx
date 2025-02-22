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
import axios from 'axios';
import { CuboidIcon as Cube } from "lucide-react";
import { useState } from "react";
import { CollaborativeEditor } from "./CollaborativeEditor";
import { useFlow } from "@/contexts/FlowContext";
import Image from "next/image";

export function Navbar() {
  const { contractName, setContractName, network, setNetwork } = useNavbar();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const { localNodes: nodes, localEdges: edges } = useFlow();
  const [showEditor, setShowEditor] = useState(false);
  const [compiledCode, setCompiledCode] = useState("");

  const handleDeploy = () => {
    const deploymentData = {
      nodeData: nodes,
      edgeData: edges,
      contractName,
      network,
    };

    window.alert("Deploying contract with data: " + JSON.stringify(deploymentData, null, 2));
    console.log("Deploying contract with data: ", deploymentData);

    axios.post("http://127.0.0.1:5000/deploy", deploymentData)
      .then(response => {
        const hash = response.data.hash;
        console.log("Deployment hash: ", hash);
        if (network === "testnet") {
          window.open(`https://sepolia.starkscan.co/contract/${hash}`, "_blank");
        } else {
          window.open(`https://starkscan.co/contract/${hash}`, "_blank");
        }
      })
      .catch(error => {
        console.error("Error deploying contract: ", error);
      });
  };

  const handleCompile = () => {
    const compilationData = {
      nodeData: nodes,
      edgeData: edges,
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
              <Image src="/blocks-logo.png" alt="Blocks Logo" width={24} height={24} className="mr-2" />
              <span className="text-2xl font-bold text-primary">Blocks</span>
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
