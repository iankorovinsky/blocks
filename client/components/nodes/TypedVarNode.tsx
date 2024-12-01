import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function TypedVarNode({ data, isConnectable }: any) {
  return (
    <Card className="w-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">Typed Variable</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Input
          placeholder="Variable name"
          value={data.name}
          onChange={(e) => data.onChange?.({ name: e.target.value })}
          className="mb-2"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="type"
          isConnectable={isConnectable}
        />
      </CardContent>
    </Card>
  );
} 