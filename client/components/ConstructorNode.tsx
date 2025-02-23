import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  data: { label: string; storage_variable: string };
  id: string;
};

const ConstructorNode = ({ data, id }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [connectedVars, setConnectedVars] = useState(0);
  const [hasCodeNode, setHasCodeNode] = useState(false);
  const { getNodes, getEdges } = useReactFlow();

  useEffect(() => {
    const interval = setInterval(() => {
      const edges = getEdges();
      const nodes = getNodes();
      
      const connectedNodeIds = edges
        .filter((edge) => edge.target === id)
        .map((edge) => edge.source);

      const connectedNodes = nodes.filter(
        (node) => connectedNodeIds.includes(node.id) && node.type === "typedVariable"
      );
      
      const typedVarCount = connectedNodes.length;
      setConnectedVars(typedVarCount);

      // Check for connected code nodes
      const codeNodes = nodes.filter(
        (node) => connectedNodeIds.includes(node.id) && node.type === "code"
      );
      setHasCodeNode(codeNodes.length > 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [getNodes, getEdges, id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      <Handle
        type="source"
        position={Position.Right}
        className="!absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 !bg-pink-400 border-2 border-[#1a1a1a]"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="!absolute right-[-12px] top-1/2 translate-y-4 w-6 h-6 !bg-pink-400 border-2 border-[#1a1a1a]"
      />
      {/* Triangle with C label */}
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-pink-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          C
        </span>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-pink-400" />
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
            value={inputValue}
            onChange={handleInputChange}
            className="nodrag w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700 focus:outline-none focus:border-pink-500 transition-colors"
            placeholder="Enter value..."
          />
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Parameters</label>
          </div>
          <div className={`w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border ${connectedVars > 0 ? 'border-pink-700 text-white-500' : 'border-gray-800 text-gray-500'}`}>
            {connectedVars > 0 
              ? `${connectedVars} parameter${connectedVars > 1 ? 's' : ''} connected`
              : 'Connect to add parameters'
            }
          </div>
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <label className="text-sm text-gray-400">Logic</label>
          </div>
          <div className={`w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border ${hasCodeNode ? 'border-pink-700 text-white' : 'border-gray-800 text-gray-500'}`}>
            {hasCodeNode ? 'Code implementation connected' : 'Connect to add logic'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructorNode; 