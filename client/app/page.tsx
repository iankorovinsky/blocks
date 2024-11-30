"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState
} from "@xyflow/react";

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useMemo, useState } from "react";
import { Cursor } from "../components/Cursor";
// import { nodeTypes } from "./types/node";
import SetFunctionNode from "@/components/SetFunctionNode";
import StorageNode from "@/components/StorageNode";


const initialNodes = [
  {
    id: "3",
    position: { x: 0, y: 200 },
    data: { label: "Set", type: "FUNCTION", identifier: "SET", storage_variable: "" },
    type: "setFunction",
  },
  {
    id: "4",
    position: { x: 400, y: 200 },
    data: { label: "Storage", type: "STORAGE_VAR", identifier: "", storage_variable: "" },
    type: "storage",
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }, { id: "e2-3", source: "2", target: "3" }];

export default function Home() {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const userCount = others.length;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );


  const handleStorageNameChange = useCallback((id: string, name: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          
          node.data = { ...node.data, storage_variable: name };
        }
        return node;
      })
    );
  }, [setNodes]);

  const nodeTypes = useMemo(() => ({
    setFunction: (props: any) => (
      <SetFunctionNode {...props} />
    ),
    storage: (props: any) => (
      <StorageNode {...props} onNameChange={handleStorageNameChange} />
    ),
  }), []);


  return (
    <>
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
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* print other player's cursors */}
        {others
          .filter((other) => other.presence.cursor !== null)
          .map(({ connectionId, presence }) => {
            if (presence.cursor) {
              console.log(`HI: ${JSON.stringify(presence.cursor)}`);
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
          nodeTypes={nodeTypes}
        >
          <Background color="#FFFFFFF" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </>
  );
}
