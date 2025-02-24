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
import { useState, useRef, useEffect } from "react";
import { CollaborativeEditor, EditorRef } from "./CollaborativeEditor";
import { useFlow } from "@/contexts/FlowContext";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function Navbar() {
  const { toast } = useToast();
  const { contractName, setContractName, network, setNetwork } = useNavbar();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const { localNodes: nodes, localEdges: edges } = useFlow();
  const [showEditor, setShowEditor] = useState(false);
  const [compiledCode, setCompiledCode] = useState("");
  const editorRef = useRef<EditorRef>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastSavedCode, setLastSavedCode] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [operationStatus, setOperationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [description, setDescription] = useState("");

  const checkForChanges = () => {
    const currentCode = editorRef.current?.getContent() || "";
    const codeChanged = currentCode !== lastSavedCode;
    setHasChanges(codeChanged);
    if (codeChanged) {
      setOperationStatus('none');
    }
  };

  useEffect(() => {
    const interval = setInterval(checkForChanges, 1000);
    return () => clearInterval(interval);
  }, [lastSavedCode]);
  const [constructorParams, setConstructorParams] = useState<Record<string, string>>({});

  const handleDeploy = () => {
    setIsDeploying(true);
    const currentCode = editorRef.current?.getContent() || "";
    setLastSavedCode(currentCode);
    setHasChanges(false);
    const deploymentData = {
      nodeData: nodes,
      edgeData: edges,
      contractName,
      network,
      code: currentCode,
      constructorParams,
    };
    console.log("Deploying contract with data: " + JSON.stringify(deploymentData, null, 2));

    axios.post("http://127.0.0.1:5000/deploy", deploymentData)
      .then(response => {
        const hash = response.data.hash;
        console.log("Deployment hash: ", hash, "     ", hash.length);
        
        if (hash === "error" || hash.length !== 66) {
          setOperationStatus('error');
          toast({
            variant: "destructive",
            title: "Deployment Failed",
            description: "There was an error deploying your contract. Please check the console for details.",
          });
          return;
        }
        
        setOperationStatus('success');
        console.log("Deploying a happy toast");

        toast({
          variant: "success",
          title: "🚀 Contract Deployed",
          description: "Your contract has been successfully deployed to the blockchain! ✨",
        });
        if (network === "testnet") {
        window.open(`https://sepolia.starkscan.co/contract/${hash}`, "_blank");
        } else {
          window.open(`https://starkscan.co/contract/${hash}`, "_blank");
        }

      })
      .catch(error => {
        setOperationStatus('error');
        console.error("Error deploying contract: ", error);
        toast({
          variant: "destructive",
          title: "Deployment Error",
          description: "Failed to deploy contract. Please try again.",
        });
      })
      .finally(() => {
        setIsDeploying(false);
      });
  };

  const handleCompile = () => {
    const hasConstructor = nodes.some(node => node.type === 'constructor');
    const compilationData = {
      nodeData: nodes,
      edgeData: edges,
      contractName,
    };

    console.log("Compiling contract with data: " + JSON.stringify(compilationData, null, 2));
    axios.post("http://127.0.0.1:5000/compile", compilationData)
      .then(response => {
        const code = response.data.code;
        const success = response.data.success;
        console.log("Compilation success: ", success);
        console.log("Compilation code: ", code);
        if (success === true) {
          setOperationStatus('success');
          setCompiledCode(code);
          setLastSavedCode(code);
          setHasChanges(false);
          setShowEditor(true);
          toast({
            variant: "success",
            title: "🎯 Compilation Successful",
            description: "Your contract has been compiled successfully! ✨",
          });
        } else {
          setOperationStatus('error');
          setCompiledCode(code);
          setLastSavedCode(code);
          setHasChanges(false);
          setShowEditor(true);
          toast({
            variant: "warning",
            title: "Compilation Warning",
            description: "We tried, this is our best estimate of what you were trying to compile.",
          });
        }
      })
      .catch(error => {
        setOperationStatus('error');
        console.error("Error compiling contract: ", error);
        setCompiledCode("// Error compiling contract");
        setLastSavedCode("// Error compiling contract");
        setHasChanges(false);
        setShowEditor(true);
        toast({
          variant: "destructive",
          title: "Compilation Error",
          description: "Failed to compile contract. Please check your code and try again.",
        });
      });
  };

  const handleVerify = () => {
    setIsVerifying(true);
    const currentCode = editorRef.current?.getContent() || "";
    setLastSavedCode(currentCode);
    setHasChanges(false);
    const verificationData = {
      nodeData: nodes,
      edgeData: edges,
      contractName,
      code: currentCode,
    };

    console.log("Verifying contract with data: " + JSON.stringify(verificationData, null, 2));
    axios.post("http://127.0.0.1:5000/verify", verificationData)
      .then(response => {
        const success = response.data.success;
        console.log("Verification success: ", success);
        if (success === true) {
          setOperationStatus('success');
          toast({
            variant: "success",
            title: "🎯 Compilation Successful",
            description: "Your contract has been compiled successfully! ✨",
          });
        } else {
          setOperationStatus('error');
          toast({
            variant: "warning",
            title: "Verification Failed",
            description: "We tried, but we couldn't verify your contract. Please check your code and try again.",
          });
        }
      })
      .catch(error => {
        setOperationStatus('error');
        console.error("Error verifying contract: ", error);
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: "Failed to verify contract. Please check your code and try again.",
        });
      })
      .finally(() => {
        setIsVerifying(false);
      });
  };

  const handleParamChange = (paramId: string, value: string) => {
    setConstructorParams(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  const handleSave = (newDescription: string) => {
    setDescription(newDescription);
    // Here you can add any additional logic to save the description
    toast({
      variant: "success",
      title: "Saved",
      description: "Your changes have been saved successfully.",
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
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-4 animate-pulse ${
                    hasChanges || isVerifying || isDeploying
                      ? "bg-yellow-400 shadow-[0_0_8px_2px_rgba(250,204,21,0.6)]"
                      : operationStatus === 'success' || operationStatus === 'none'
                      ? "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]"
                      : "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]"
                  }`} />
                  <Button onClick={handleVerify} disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                <Button onClick={handleDeploy} disabled={isDeploying}>
                  {isDeploying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying
                    </>
                  ) : (
                    "Deploy"
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setShowEditor(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <CollaborativeEditor 
                ref={editorRef}
                initialValue={compiledCode} 
                onClose={() => setShowEditor(false)}
                name={contractName}
                onSave={handleSave}
              />
              {nodes.some(node => node.type === 'constructor') && (
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t shadow-lg transform translate-y-[95%] hover:translate-y-0 transition-transform duration-200 z-50 rounded-b-lg">
                  <div className="flex justify-center p-2 border-b">
                    <div className="w-12 h-1 bg-gray-300 rounded-full" />
                  </div>
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2">Constructor Parameters</h3>
                    <div className="space-y-2 pr-4 pb-6">
                      {nodes
                        .filter(node => node.type === 'typedVariable' && 
                          edges.some(edge => 
                            edge.target === nodes.find(n => n.type === 'constructor')?.id && 
                            edge.source === node.id
                          )
                        )
                        .map(node => {
                          const paramType = edges
                            .filter(edge => edge.target === node.id)
                            .map(edge => 
                              nodes.find(n => n.id === edge.source)?.data?.identifier
                            )[0] || '';

                          return (
                            <div key={node.id} className="flex flex-col gap-2">
                              {/* @ts-ignore */}
                              <span className="font-medium text-sm">{node.data.label}</span>
                              <Input
                                placeholder={`Enter ${paramType}`}
                                value={constructorParams[node.id] || ''}
                                onChange={(e) => handleParamChange(node.id, e.target.value)}
                                className="w-1/4 h-8 px-2 py-1"
                              />
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
