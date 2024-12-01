import { Handle, Position } from "@xyflow/react";
import { Plus } from "lucide-react";

interface IncrementNodeProps {
  data: {
    label: string;
  };
  isConnectable: boolean;
}

export function IncrementNode({ data, isConnectable }: IncrementNodeProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-400" />
          <span className="font-medium">{data.label}</span>
        </div>
      </div>
      <div className="p-4">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
      </div>
    </div>
  );
}

export default IncrementNode; 