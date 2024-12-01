import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReadWithParamNode({ data, isConnectable }: any) {
  return (
    <Card className="w-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">Read With Param</CardTitle>
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
            id="paramType"
            style={{ top: "70%" }}
            isConnectable={isConnectable}
          />
        </div>
      </CardContent>
    </Card>
  );
} 