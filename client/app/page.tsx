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
import React, { useCallback, useRef, useEffect } from "react";
import { nodeTypes } from "./types/node";
import { SidePanel } from "@/components/SidePanel";

const edgeTypes = {
  custom: CustomEdge,
};

function FlowContent() {
  const flowRef = useRef<HTMLDivElement>(null);
  const { getViewport } = useReactFlow();
  const { setLocalNodes, setLocalEdges } = useFlow();

  const [nodes, setNodes] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  // Update context whenever nodes/edges change
  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

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
