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
import React, { useCallback } from "react";
import { Cursor } from "./components/Cursor";
import { nodeTypes } from "./types/node";


const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" }, type: "input" },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  {
    id: "3",
    position: { x: 0, y: 200 },
    data: { label: "2" },
    type: "setFunction",
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

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
          {/* <Panel position="top-left">top-left</Panel>
          <Panel position="top-center">top-center</Panel>
          <Panel position="top-right">top-right</Panel>
          <Panel position="bottom-left">bottom-left</Panel>
          <Panel position="bottom-center">bottom-center</Panel>
          <Panel position="bottom-right">bottom-right</Panel> */}
        </ReactFlow>
      </div>
    </>
  );
}
