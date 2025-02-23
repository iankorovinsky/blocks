import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Hash } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  data: { 
    label: string; 
    type: string; 
    identifier: string;
    structName?: string;
    fields?: Array<{name: string, type: string}>;
  };
  id: string;
};

const COMPOUNDS = ["struct"];

const CompoundNode = ({ data, id }: Props) => {
  const [compoundType, setCompoundType] = useState("");
  const [fields, setFields] = useState<Array<{name: string, type: string}>>([]);
  const { setNodes, getEdges, getNodes } = useReactFlow();

  // Update connected primitive types
  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = getNodes();
      const edges = getEdges();

      const connectedNodeIds = edges
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => (edge.source === id ? edge.target : edge.source));

      const connectedPrimitives = nodes
        .filter((node) => 
          connectedNodeIds.includes(node.id) && 
          node.type === "primitive"
        )
        .map(node => ({
          name: node.data?.name || "field",
          type: node.data?.identifier
        }))
        .filter(field => field.type); // Only include fields with valid types

      if (JSON.stringify(fields) !== JSON.stringify(connectedPrimitives)) {
        // @ts-ignore
        setFields(connectedPrimitives);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [getNodes, getEdges, id, fields]);

  // Update node data
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            identifier: compoundType,
            fields: fields,
          };
        }
        return node;
      }),
    );
  }, [compoundType, fields, id, setNodes]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      <div className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-purple-500 border-l-transparent
        overflow-visible rounded">
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          C
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
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <label className="text-sm text-gray-400">Connected Fields</label>
          </div>
          <div className="space-y-1">
            {fields.length > 0 ? (
              fields.map((field, index) => (
                <div key={index} className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700">
                  {field.name}: {field.type}
                </div>
              ))
            ) : (
              <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
                Connect primitive type nodes
              </div>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
      />
    </div>
  );
};

export default CompoundNode;
