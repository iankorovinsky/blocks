import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Database } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

type Props = {
  id: string;
  data: {
    label: string;
    storage_variable: string;
  };
};

const StorageNode = ({ id, data }: Props) => {
  const [typeValue, setTypeValue] = useState("");
  const { setNodes, getEdges, getNodes } = useReactFlow();
  const [variableName, setVariableName] = useState(data.storage_variable);

  // changes storage_variable to the new name
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setVariableName(newName);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, storage_variable: newName };
        }
        if (node.type === "setFunction") {
          const connectedEdge = getEdges().find(
            (edge) => edge.target === node.id,
          );
          if (connectedEdge && connectedEdge.source === id) {
            node.data = { ...node.data, storage_variable: newName };
          }
        }
        return node;
      }),
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = getNodes();
      const edges = getEdges();

      const connectedNodeIds = edges
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => (edge.source === id ? edge.target : edge.source));

      const connectedNode = nodes.find((node) =>
        connectedNodeIds.includes(node.id),
      );

      if (connectedNode && connectedNode.type === "primitive") {
        console.log(connectedNode.data?.identifier);
        setTypeValue(connectedNode.data?.identifier as string);
      } else if (connectedNode && connectedNode.type === "compound") {
        console.log(connectedNode.data?.identifier);
        setTypeValue(
          `${connectedNode.data?.identifier as string}<${connectedNode.data?.primitiveType}>`,
        );
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, [getNodes, getEdges, id, typeValue]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-blue-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          S
        </span>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="font-medium">{data.label}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <label className="text-sm text-gray-400">Name</label>
          </div>
          <input
            type="text"
            value={variableName}
            onChange={handleNameChange}
            className="nodrag w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter name..."
          />
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Storage Variable</label>
          </div>

          {typeValue !== "" ? (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700">
              {typeValue}
            </div>
          ) : (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
              Connect to a type
            </div>
          )}

          <Handle
            type="source"
            position={Position.Right}
            className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
            id="a"
          />
          <Handle
            type="target"
            position={Position.Right}
            className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
            id="a"
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
        id="b"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
        id="b"
      />
    </div>
  );
};

export default StorageNode;
