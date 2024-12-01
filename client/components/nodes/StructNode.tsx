import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function StructNode({ data, isConnectable }: any) {
  return (
    <Card className="w-[250px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">Struct</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Input
          placeholder="Struct name"
          value={data.name}
          onChange={(e) => data.onChange?.({ name: e.target.value })}
          className="mb-2"
        />
        <div className="variables-container">
          <Handle
            type="target"
            position={Position.Left}
            id="variables"
            isConnectable={isConnectable}
          />
        </div>
      </CardContent>
    </Card>
  );
} 