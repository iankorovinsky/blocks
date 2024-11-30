import { Handle, Position, useReactFlow } from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import { Database } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  id: string;
  data: { 
    label: string;
    onNameChange: (id: string, name: string) => void;
  };
};

const StorageNode = ({ id, data }: Props) => {
  const [name, setName] = useState("");
  const [typeValue, setTypeValue] = useState("string");
  const { getNode, getEdges } = useReactFlow();

  const isConnected = useCallback(() => {
    const edges = getEdges();
    return edges.some(edge => edge.source === id || edge.target === id);
  }, [id, getEdges]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    data.onNameChange(id, newName);
  };

  useEffect(() => {
    if (name) {
      data.onNameChange(id, name);
    }
  }, [id, name, data]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      <div className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-blue-500 border-l-transparent
        overflow-visible rounded">
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
            value={name}
            onChange={handleNameChange}
            className="nodrag w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter name..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Type</label>
          </div>
          <Select
            value={typeValue}
            onValueChange={setTypeValue}
          >
            <SelectTrigger className="w-full bg-[#2a2a2a] border-gray-700 text-sm focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="array">Array</SelectItem>
              <SelectItem value="object">Object</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Top} 
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]" 
      />
      <Handle 
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
      />
    </div>
  );
};

export default StorageNode;

