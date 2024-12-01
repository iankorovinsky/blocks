import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface TypedVarData {
  data: {
    label: string;
    value: string | number;
    name: string;
    onChange?: (update: { name: string }) => void;
  };
  isConnectable: boolean;
}

export function TypedVarNode({ data, isConnectable }: TypedVarData) {
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