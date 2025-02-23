import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Variable } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  data: { label: string; storage_variable: string };
  id: string;
};

const TypedVariableNode = ({ data, id }: Props) => {
  const { getNodes, getEdges } = useReactFlow();
  const [inputValue, setInputValue] = useState(data.label || "");
  const [storageVariable, setStorageVariable] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = getNodes();
      const edges = getEdges();

      const connectedNodeIds = edges
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => (edge.source === id ? edge.target : edge.source));

      const connectedNode = nodes.find((node) =>
        connectedNodeIds.includes(node.id) && node.type === "primitive"
      );

      if (connectedNode && connectedNode.data?.identifier) {
        setStorageVariable(connectedNode.data.identifier as string);
      } else {
        setStorageVariable("");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getNodes, getEdges, id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    data.label = newValue;
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-green-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          V
        </span>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Variable className="w-4 h-4 text-blue-400" />
          <span className="font-medium">{data.label}</span>
        </div>
      </div>

      <div className="p-4">
        <Handle
          type="source"
          position={Position.Left}
          isConnectable={true}
          className="!top-[50%] -translate-y-1/2 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
        />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <label className="text-sm text-gray-400">Name</label>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="nodrag w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter value..."
          />
        </div>

        <div className="mt-4 space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Type</label>
          </div>
          {storageVariable ? (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700">
              {storageVariable}
            </div>
          ) : (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
              Connect to add type
            </div>
          )}

          <Handle
            type="target"
            position={Position.Right}
            className="top-12 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
          />
        </div>
      </div>
    </div>
  );
};

export default TypedVariableNode; 