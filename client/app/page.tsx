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
import { ChatBot } from "@/components/Chatbot";
import CustomEdge from "@/components/CustomEdge";
import { FlowWrapper } from "@/components/FlowWrapper";
import { Navbar } from "@/components/Navbar";
import { NodeTemplate } from "@/components/SidebarNodePallette";
import { FlowProvider, useFlow } from "@/contexts/FlowContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { LiveList } from "@liveblocks/client";
import { useMutation, useMyPresence, useOthers, useStorage } from "@liveblocks/react/suspense";
import { MarkerType } from '@xyflow/react';
import "@xyflow/react/dist/style.css";
import axios from "axios";
import React, { useCallback, useEffect, useRef } from "react";
import type { Presence, SerializedEdge, SerializedNode } from '../liveblocks.config';
import { nodeTypes } from "./types/node";

const edgeTypes = {
  custom: CustomEdge,
};

function FlowContent({
  updatePresence,
}: {
  updatePresence: (presence: Partial<Presence>) => void;
  presence: Presence;
}) {
  const flowRef = useRef<HTMLDivElement>(null);
  const { getViewport } = useReactFlow();
  const others = useOthers();

  const [myPresence, updateMyPresence] = useMyPresence();

  const nodes = useStorage((root) => root.nodes);
  const edges = useStorage((root) => root.edges);

  const [localNodes, setNodes] = useNodesState(
    nodes ? Array.from(nodes as unknown as LiveList<SerializedNode>).map(node => node as unknown as Node) : []
  );
  const [localEdges, setEdges, onEdgesChange] = useEdgesState(
    edges ? Array.from(edges as unknown as LiveList<SerializedEdge>).map(edge => edge as unknown as Edge) : []
  );

  const updateNodes = useMutation(({ storage }, nodes: SerializedNode) => {
    const list = storage.get("nodes") as LiveList<SerializedNode>;
    list.push(nodes);
  }, []);

  const updateEdges = useMutation(({ storage }, edge: SerializedEdge) => {
    const list = storage.get("edges") as LiveList<SerializedEdge>;
    list.push(edge);
  }, []);

  const updateNodePosition = useMutation(({ storage }, update: { id: string, position: { x: number, y: number } }) => {
    const list = storage.get("nodes") as LiveList<SerializedNode>;
    const nodes = Array.from(list);
    const nodeIndex = nodes.findIndex(n => n.id === update.id);
    
    if (nodeIndex !== -1) {
      const node = nodes[nodeIndex];
      if (node) {
        list.set(nodeIndex, { ...node, position: update.position });
      }
    }
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    changes.forEach((change) => {
      if (change.type === 'position' && 'position' in change && change.position) {
        if (!change.dragging) {
          updateNodePosition({
            id: change.id,
            position: { x: change.position.x, y: change.position.y }
          });
          updateMyPresence({
            ...myPresence,
            draggedNode: null
          });
        } else {
          updateMyPresence({
            ...myPresence,
            draggedNode: { id: change.id, position: change.position }
          });
        }
      }
    });

    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes, updateNodes, updateMyPresence, myPresence, updateNodePosition]);

  useEffect(() => {
    others.forEach((other) => {
      const draggedNode = other.presence?.draggedNode as { id: string; position: { x: number; y: number } };
      if (draggedNode) {
        setNodes((nds) =>
          nds.map((n: unknown) => {
            const node = n as Node;
            return node.id === draggedNode.id
              ? { ...node, position: draggedNode.position }
              : node;
          })
        );
      }
    });
  }, [others, setNodes]);

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

      const newNode: SerializedNode = {
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

      updateNodes(newNode);

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, updateNodes],
  );

  const onConnect = useCallback((params: Connection) => {
    const newEdge = { id: `e${params.source}-${params.target}`, ...params };
    updateEdges(newEdge);
    setEdges((eds) => addEdge(params, eds));
  }, [updateEdges, setEdges]);

  return (
    <FlowProvider value={{ localNodes, localEdges }}>
      <div ref={flowRef} className="relative" style={{ width: "100%", height: "93vh" }}>
        <ReactFlow
          nodes={localNodes}
          edges={localEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          onMouseMove={(e) => {
            if (flowRef.current) {
              const bounds = flowRef.current.getBoundingClientRect();
              const { zoom, x: vpX, y: vpY } = getViewport();

              const flowX = (e.clientX - bounds.left - vpX) / zoom;
              const flowY = (e.clientY - bounds.top - vpY) / zoom;

              updatePresence({
                cursor: {
                  x: flowX,
                  y: flowY,
                  flowX,
                  flowY
                },
                lastActive: Date.now(),
              });
            }
          }}
          onMouseLeave={() => {
            updatePresence({
              cursor: null,
            });
          }}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 15,
              height: 15,
              color: '#94a3b8',
            },
          }}
        >
          <Background color="#FFFFFF" variant={BackgroundVariant.Dots} />
        </ReactFlow>

        <AISearch />
        <ChatBot />
      </div>
    </FlowProvider>
  );
}

// Main component now just handles the provider setup
export default function Home() {
  const { contractName, network } = useNavbar();
  const [myPresence, updateMyPresence] = useMyPresence();
  const { localNodes, localEdges } = useFlow();

  const handleDeploy = useCallback(() => {
    const deploymentData = {
      nodeData: localNodes,
      edgeData: localEdges,
      contractName,
      network,
    };

    window.alert("Deploying contract with data: " + JSON.stringify(deploymentData, null, 2));
    console.log("Deploying contract with data: ", JSON.stringify(deploymentData, null, 2));

    axios.post("https://apt-polished-raptor.ngrok-free.app/deploy", deploymentData)
      .then(response => {
        const hash = response.data.hash;
        console.log("Deployment hash: ", hash);
        window.open(`https://sepolia.starkscan.co/contract/${hash}`, "_blank");
      })
      .catch(error => {
        console.error("Error deploying contract: ", error);
      });
  }, [contractName, network, localNodes, localEdges]);

  return (
    <>
      <Navbar onDeploy={handleDeploy} />
      <div className="relative" style={{ width: "100%", height: "93vh" }}>
        <FlowWrapper>
          <FlowContent
            updatePresence={updateMyPresence}
            presence={myPresence as Presence}
          />
        </FlowWrapper>
      </div>
    </>
  );
}
