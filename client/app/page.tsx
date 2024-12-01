"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  ReactFlow,
  useEdgesState,
  useNodesState
} from "@xyflow/react";

import AISearch from "@/components/AIAgentSearchbar";
import { Navbar } from "@/components/Navbar";
import { NodeTemplate } from "@/components/SidebarNodePallette";
import { useNavbar } from "@/contexts/NavbarContext";
import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import "@xyflow/react/dist/style.css";
import React, { useCallback } from "react";
import { Cursor } from "../components/Cursor";
import { nodeTypes } from "./types/node";

const initialNodes = [
  {
    id: "3",
    position: { x: 0, y: 200 },
    data: { label: "Set", type: "FUNCTION", identifier: "SET", name: "" }, // todo: set name
    type: "setFunction",
  },
  {
    id: "4",
    position: { x: 400, y: 200 },
    data: {
      label: "Storage",
      type: "STORAGE_VAR",
      identifier: "",
      storage_variable: "",
    },
    type: "storage",
  },
  {
    id: "5",
    position: { x: 800, y: 200 },
    data: { label: "Primitive", type: "PRIM_TYPE", identifier: "" },
    type: "primitive",
  },
  {
    id: "6",
    position: { x: 0, y: 600 },
    data: { label: "Compound", type: "COMPOUND_TYPE", identifier: "" },
    type: "compound",
  },
  {
    id: "7",
    position: { x: 400, y: 600 },
    data: { label: "Get", type: "FUNCTION", identifier: "" },
    type: "getFunction",
  },
];

const initialEdges = [
  { id: "e1-2", source: "3", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];


export default function Home() {
  const { contractName, network } = useNavbar();

  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // const nodeStorage = useStorage(() => initialNodes);
  // const edgeStorage = useStorage(() => initialEdges);


  // const updateNodeStorage = useMutation(({ storage }, newNodeData) => {
  //   const nodeData = storage.get("nodeData");
  //   storage.set("nodeData", newNodeData);
  // }, []);  


  const handleDeploy = useCallback(() => {
    const deploymentData = {
      nodeData: nodes,
      edgeData: edges,
      contractName: contractName,
      network: network,
    };

    window.alert("Deploying contract with data: " +  JSON.stringify(deploymentData, null, 2));
    console.log("Deploying contract with data: ", deploymentData);

    // Add your deployment logic here (e.g., API call or contract deployment)
  }, [contractName, network, nodes, edges]);

  // print json data of nodes, edges
  // console.log(
  //   JSON.stringify({
  //     nodeData: nodes,
  //     edgeData: edges,
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

      if (
        typeof nodeInformation.type === "undefined" ||
        !nodeInformation.type
      ) { 
        return;
      }

      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      };


      const newNode = {
        id: `${nodeInformation.type}_${Date.now()}`,
        type: nodeInformation.type,
        position,
        data: {
          label: nodeInformation.data.label || "",
          type: nodeInformation.data.type || "",
          identifier: nodeInformation.data.identifier || "",
          name: nodeInformation.data.name as undefined,
          storage_variable: nodeInformation.data.storage_variable as string,
          primitiveType: nodeInformation.data.primitiveType as string,
        },
      };
      
      // 
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // useEffect(() => {
  //   console.log(nodes);
  // }, [nodes]);

  return (
    <>
      <Navbar onDeploy={handleDeploy} />
      <div
        onPointerMove={(e: React.PointerEvent<HTMLDivElement>) => {
          const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
          updateMyPresence({ cursor });
        }}
        onPointerLeave={() => {
          const cursor = {
            cursor: null,
          };
          updateMyPresence(cursor);
        }}
        className="relative"
        style={{ width: "100%", height: "93vh" }}
      >
        {/* print other player's cursors */}
        {others
          .filter((other) => other.presence.cursor !== null)
          .map(({ connectionId, presence }) => {
            if (presence.cursor) {
              return (
                <Cursor
                  key={connectionId}
                  x={presence.cursor.x}
                  y={presence.cursor.y}
                />
              );
            }
          })}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
        >
          <Background color="#FFFFFFF" variant={BackgroundVariant.Dots} />
        </ReactFlow>

        <AISearch />
      </div>
    </>
  );
}
