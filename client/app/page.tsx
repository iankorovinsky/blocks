"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
  applyNodeChanges,
  NodeChange,
  useReactFlow,
  ReactFlowInstance
} from "@xyflow/react";

import AISearch from "@/components/AIAgentSearchbar";
import { Navbar } from "@/components/Navbar";
import { NodeTemplate } from "@/components/SidebarNodePallette";
import { useNavbar } from "@/contexts/NavbarContext";
import { useMutation, useMyPresence, useOthers, useStorage } from "@liveblocks/react/suspense";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect, useRef } from "react";
import { Cursor } from "../components/Cursor";
import { nodeTypes } from "./types/node";

import axios from "axios";
import { ChatBot } from "@/components/Chatbot";
import { LiveList, LiveObject } from "@liveblocks/client";
import { SerializedNode } from "@/liveblocks.config";
import { FlowCursors } from '@/components/FlowCursors';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];


export default function Home() {
  const { contractName, network } = useNavbar();
  const others = useOthers();
  
  const [myPresence, updateMyPresence] = useMyPresence<Presence>();
  
  const nodes = useStorage((root) => root.nodes);
  const edges = useStorage((root) => root.edges);

  const [localNodes, setNodes] = useNodesState(nodes ? Array.from(nodes) as Node[] : []);
  const [localEdges, setEdges, onEdgesChange] = useEdgesState(edges ? Array.from(edges) as Edge[] : []);

  const updateNodes = useMutation(({ storage }) => {
    storage.set("nodes", nodes);
  }, []);

  const updateEdges = useMutation(({ storage }) => {
    storage.set("edges", edges);
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    changes.forEach((change) => {
      if (change.type === 'position' && 'position' in change) {
        if (change.dragging) {
          updateMyPresence({
            ...myPresence,
            draggedNode: { id: change.id, position: change.position }
          });
        } else {
          updateNodes((root) => {
            const nodeIndex = root.nodes.findIndex(n => n.id === change.id);
            if (nodeIndex !== -1) {
              const node = root.nodes.get(nodeIndex);
              if (node) {
                root.nodes.set(nodeIndex, {
                  ...node,
                  position: change.position
                });
              }
            }
          });
          updateMyPresence({
            ...myPresence,
            draggedNode: null
          });
        }
      }
    });

    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes, updateNodes, updateMyPresence, myPresence]);

  useEffect(() => {
    others.forEach((other) => {
      const draggedNode = other.presence?.draggedNode;
      if (draggedNode) {
        setNodes((nds) => 
          nds.map((n) => 
            n.id === draggedNode.id 
              ? { ...n, position: draggedNode.position }
              : n
          )
        );
      }
    });
  }, [others, setNodes]);

  const handleDeploy = useCallback(() => {
    const deploymentData = {
      nodeData: localNodes,
      edgeData: localEdges,
      contractName: contractName,
      network: network,
    };

    window.alert("Deploying contract with data: " +  JSON.stringify(deploymentData, null, 2));
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


  }, [contractName, network, localNodes, localEdges]);

  // print json data of nodes, edges
  // console.log(
  //   JSON.stringify({
  //     nodeData: localNodes,
  //     edgeData: localEdges,
  //   }),
  // );

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

      // Update Liveblocks storage
      updateNodes((root) => {
        root.nodes.push(newNode);
      });
      
      // Update local state
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, updateNodes],
  );

  const onConnect = useCallback((params: Connection) => {
    const newEdge = { id: `e${params.source}-${params.target}`, ...params };
    updateEdges((root) => {
      root.edges.push(newEdge);
    });
    setEdges((eds) => addEdge(params, eds));
  }, [updateEdges, setEdges]);

  // useEffect(() => {
  //   console.log(localNodes);
  // }, [localNodes]);

  const flowRef = useRef<HTMLDivElement>(null);
  const { project, getViewport } = useReactFlow();

  return (
    <>
      <Navbar onDeploy={handleDeploy} />
      <div
        ref={flowRef}
        className="relative"
        style={{ width: "100%", height: "93vh" }}
      >
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
              
              // Get position relative to the viewport
              const x = (e.clientX - bounds.left - vpX) / zoom;
              const y = (e.clientY - bounds.top - vpY) / zoom;
              
              updateMyPresence({
                ...myPresence,
                cursor: { x, y },
                lastActive: Date.now()
              });
            }
          }}
          onMouseLeave={() => updateMyPresence({
            ...myPresence,
            cursor: null
          })}
        >
          <Background color="#FFFFFF" variant={BackgroundVariant.Dots} />
          <FlowCursors others={others} />
        </ReactFlow>

        <AISearch />
        <ChatBot />
      </div>
    </>
  );
}
