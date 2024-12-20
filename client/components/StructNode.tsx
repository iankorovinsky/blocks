import { Handle, Position } from "@xyflow/react";
import { FolderTree } from "lucide-react";
import { useState } from "react";

interface StructNodeProps {
  data: {
    name: string;
    label: string;
    onChange?: (updates: { name: string }) => void;
  };
  isConnectable: boolean;
}

export function StructNode({ data }: StructNodeProps) {
  const [inputValue, setInputValue] = useState(data.name);
  const [storageVariable] = useState<string | undefined>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    data.onChange?.({ name: e.target.value });
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-yellow-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          S
        </span>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-blue-400" />
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
            className="nodrag w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter value..."
          />
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Typed Variables</label>
          </div>
          {storageVariable ? (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700">
              {storageVariable}
            </div>
          ) : (
            <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
              Connect to add typed variables
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

export default StructNode; 