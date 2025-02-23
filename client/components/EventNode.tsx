import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  data: { label: string };
  id: string;
};

const EventNode = ({ data, id }: Props) => {
  const [structName, setStructName] = useState<string>("");
  const [structValue, setStructValue] = useState<string>("");
  const { getNodes, getEdges } = useReactFlow();

  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = getNodes();
      const edges = getEdges();

      const connectedEdges = edges.filter(
        (edge) => edge.source === id || edge.target === id
      );

      const structEdge = connectedEdges.find((edge) => {
        const connectedNode = nodes.find(
          (node) => node.id === (edge.source === id ? edge.target : edge.source)
        );
        return connectedNode?.data?.type === "STRUCT";
      });

      if (structEdge) {
        const structNode = nodes.find(
          (node) =>
            node.id === (structEdge.source === id ? structEdge.target : structEdge.source)
        );
        
        if (structNode?.data) {
          const name = typeof structNode.data.name === 'string' ? structNode.data.name : '';
          const fields = Array.isArray(structNode.data.fields) ? structNode.data.fields : [];
          setStructName(name);
          setStructValue(JSON.stringify(fields));
        }
      } else {
        setStructName("");
        setStructValue("");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getNodes, getEdges, id]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      {/* Triangle with F label */}
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-pink-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          E
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
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <label className="text-sm text-gray-400">Name</label>
          </div>
          {structName ? (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700">
              {structName}
            </div>
          ) : (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
              Connect a struct!
            </div>
          )}
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <label className="text-sm text-gray-400">Structure</label>
          </div>
          {structValue ? (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
              Struct connected!
            </div>
          ) : (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
              Connect a struct!
            </div>
          )}

          <Handle
            type="source"
            position={Position.Right}
            className="top-12 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
          />
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

export default EventNode;