import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WriteNodeProps {
  data: Record<string, unknown>;
  isConnectable: boolean;
}

export function WriteNode({ isConnectable }: WriteNodeProps) {
  return (
    <Card className="w-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">Write</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <Handle
            type="target"
            position={Position.Left}
            id="storage"
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="param1"
            style={{ top: "60%" }}
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="param2"
            style={{ top: "80%" }}
            isConnectable={isConnectable}
          />
        </div>
      </CardContent>
    </Card>
  );
} 