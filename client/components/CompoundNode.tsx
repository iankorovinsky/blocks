import { Handle, Position, useReactFlow } from "@xyflow/react";
import React, { useEffect, useMemo, useState } from "react";
import { Hash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data: { label: string; type: string; identifier: string };
  id: string;
};

const COMPOUNDS = ["array", "tuple"];

const SetFunctionNode = ({ data, id }: Props) => {
  const [compoundType, setCompoundType] = useState("");
  const [primitiveType, setPrimitiveType] = useState("");
  const { setNodes, getEdges, getNodes } = useReactFlow();

  // update the overall state of the node
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            identifier: compoundType,
            primitiveType: primitiveType,
          };
        }

        return node;
      }),
    );
  }, [compoundType, primitiveType]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = getNodes();
      const edges = getEdges();

      const connectedNodeIds = edges
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => (edge.source === id ? edge.target : edge.source));

      const allConnectedNodes = nodes.filter((node) =>
        connectedNodeIds.includes(node.id),
      );

      for (const connectedNode of allConnectedNodes) {
        if (connectedNode.type === "primitive") {
          setPrimitiveType(connectedNode.data?.identifier as string);
        }
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, [getNodes, getEdges, id, primitiveType]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      {/* Triangle with T label */}
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-purple-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          T
        </span>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-400" />
          <span className="font-medium">{data.label}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Data structure</label>
          </div>

          <Select value={compoundType} onValueChange={setCompoundType}>
            <SelectTrigger className="w-full bg-[#2a2a2a] border-gray-700 text-sm focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
              {COMPOUNDS.map((compound) => (
                <SelectItem key={compound} value={compound}>
                  {compound}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Type</label>
          </div>
          {primitiveType !== "" ? (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700">
              {primitiveType}
            </div>
          ) : (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
              Connect to a primitive type
            </div>
          )}

          <Handle
            type="source"
            position={Position.Right}
            className="top-12 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
            id="a"
          />
          <Handle
            type="target"
            position={Position.Right}
            className="top-12 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
            id="b"
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
        id="c"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
        id="d"
      />
    </div>
  );
};

export default SetFunctionNode;
