"use client";

import {
  addEdge,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  NodeChange,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";

import AISearch from "@/components/AIAgentSearchbar";
import CustomEdge from "@/components/CustomEdge";
import { FlowWrapper } from "@/components/FlowWrapper";
import { Navbar } from "@/components/Navbar";
import { NodeTemplate } from "@/components/SidebarNodePallette";
import { useFlow } from "@/contexts/FlowContext";
import { MarkerType } from '@xyflow/react';
import "@xyflow/react/dist/style.css";
import React, { useCallback, useRef, useEffect, useState } from "react";
import { nodeTypes } from "./types/node";
import { SidePanel } from "@/components/SidePanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavbar } from "@/contexts/NavbarContext";
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from "@/components/ui/use-toast";
import { saveContract } from '@/lib/supabase';

const edgeTypes = {
  custom: CustomEdge,
};

function FlowContent() {
  const flowRef = useRef<HTMLDivElement>(null);
  const { getViewport } = useReactFlow();
  const { setLocalNodes, setLocalEdges } = useFlow();
  const { contractName } = useNavbar();
  const { user } = useAuth0();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const [nodes, setNodes] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  useEffect(() => {
    console.log("Setting up keyboard listener in Flow");
    
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("Key pressed in Flow:", e.key, "Ctrl:", e.ctrlKey, "Shift:", e.shiftKey);
      
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        console.log("Ctrl+Shift+S detected in Flow!");
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update context whenever nodes/edges change
  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  // Add event listener for clearing the editor
  useEffect(() => {
    const handleClearEditor = () => {
      setNodes([]);
      setEdges([]);
      setLocalNodes([]);
      setLocalEdges([]);
    };

    const handleLoadExample = (event: CustomEvent) => {
      const { nodes: exampleNodes, edges: exampleEdges } = event.detail;
      setNodes(exampleNodes);
      setEdges(exampleEdges);
      setLocalNodes(exampleNodes);
      setLocalEdges(exampleEdges);
    };

    window.addEventListener('clearEditor', handleClearEditor);
    window.addEventListener('loadExample', handleLoadExample as EventListener);
    
    return () => {
      window.removeEventListener('clearEditor', handleClearEditor);
      window.removeEventListener('loadExample', handleLoadExample as EventListener);
    };
  }, [setNodes, setEdges, setLocalNodes, setLocalEdges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeInformation: NodeTemplate = JSON.parse(
        event.dataTransfer.getData("application/reactflow"),
      );

      if (!nodeInformation.type) return;

      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      };

      const newNode: Node = {
        id: `${nodeInformation.type}_${Date.now()}`,
        type: nodeInformation.type,
        position,
        data: {
          label: nodeInformation.data.label || "",
          type: nodeInformation.data.type || "",
          identifier: nodeInformation.data.identifier || "",
          storage_variable: nodeInformation.data.storage_variable as string,
          primitiveType: nodeInformation.data.primitiveType as string,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes],
  );

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  return (
    <div ref={flowRef} className="relative" style={{ width: "100%", height: "93vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'custom',
        }}
      >
        <Background color="#FFFFFF" variant={BackgroundVariant.Dots} />
      </ReactFlow>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={contractName || "SampleContract"}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={async () => {
              if (!user?.email) {
                toast({
                  variant: "destructive",
                  title: "Login Required",
                  description: "Please log in to save your flow.",
                });
                return;
              }
              
              try {
                console.log("Saving flow with description:", description);
                console.log("Node data:", nodes);
                console.log("Edge data:", edges);
                console.log("User email:", user.email);
                
                await saveContract(contractName || "SampleContract", description, user.email, nodes, edges);
                
                toast({
                  variant: "success",
                  title: "Blocks Saved",
                  description: "Your blocks have been saved successfully! Check out your history tab to see them ✨",
                });
                
                setIsModalOpen(false);
              } catch (error) {
                console.error("Failed to save contract:", error);
                toast({
                  variant: "destructive",
                  title: "Save Failed",
                  description: "Failed to save your blocks. Please try again.",
                });
              }
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AISearch />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative" style={{ width: "100%", height: "93vh" }}>
        <FlowWrapper>
          <FlowContent />
        </FlowWrapper>
      </div>
      <SidePanel />
    </>
  );
}
