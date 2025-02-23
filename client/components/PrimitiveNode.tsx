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
  data: { label: string; type: string; identifier: string };
  id: string;
};

const PRIMITIVES = [
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "u256",
  "usize",
  "bool",
  "felt252",
  "bytes31",
  "ByteArray",
  "ContractAddress"
];

const SetFunctionNode = ({ data, id }: Props) => {
  const [typeValue, setTypeValue] = useState("");
  const { setNodes } = useReactFlow();

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, identifier: typeValue };
        }

        return node;
      }),
    );
  }, [typeValue, id, setNodes]);

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
            <label className="text-sm text-gray-400">Type</label>
          </div>

          <Select value={typeValue} onValueChange={setTypeValue}>
            <SelectTrigger className="w-full bg-[#2a2a2a] border-gray-700 text-sm focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
              {PRIMITIVES.map((primitive) => (
                <SelectItem key={primitive} value={primitive}>
                  {primitive}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Left}
        className="top-12 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="bottom-12 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
      />
    </div>
  );
};

export default SetFunctionNode;
