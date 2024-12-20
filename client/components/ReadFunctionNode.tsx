import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  data: { label: string; storage_variable: string };
  id: string;
};

const ReadFunctionNode = ({ data, id }: Props) => {
  const [storageVariable, setStorageVariable] = useState<string | undefined>(
    "",
  );
  const { getNodes, getEdges } = useReactFlow();

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

      if (
        connectedNode && 
        connectedNode.data?.storage_variable !== storageVariable
      ) {
        setStorageVariable(connectedNode.data?.storage_variable as string);
      }
    }, 1000); // Check every 500ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, [getNodes, getEdges, id, storageVariable]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      {/* Triangle with F label */}
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-orange-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          F
        </span>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-blue-400" />
          <span className="font-medium">{data.label}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <label className="text-sm text-gray-400">Type</label>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
            Connect to set type
          </div>

          <Handle
            id="type-source"
            type="source"
            position={Position.Right}
            className="!top-[40%] w-6 h-6 !bg-purple-400 border-2 border-[#1a1a1a]"
          />
          <Handle
            id="type-target"
            type="target"
            position={Position.Right}
            className="!top-[40%] w-6 h-6 !bg-purple-400 border-2 border-[#1a1a1a]"
          />
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Storage Variable</label>
          </div>
          {storageVariable ? (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700">
              {storageVariable}
            </div>
          ) : (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
              Connect to display storage variable
            </div>
          )}

          <Handle
            id="storage-source"
            type="source"
            position={Position.Right}
            className="!top-[40%] w-6 h-6 !bg-orange-400 border-2 border-[#1a1a1a]"
          />
          <Handle
            id="storage-target"
            type="target"
            position={Position.Right}
            className="!top-[40%] w-6 h-6 !bg-orange-400 border-2 border-[#1a1a1a]"
          />
        </div>
      </div>
    </div>
  );
};

export default ReadFunctionNode;
