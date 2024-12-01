import { TypedVarNode } from "./nodes/TypedVarNode";
import { StructNode } from "./nodes/StructNode";
import { WriteNode } from "./nodes/WriteNode";
import { ReadWithParamNode } from "./nodes/ReadWithParamNode";
// ... existing imports ...

export const nodeTypes = {
  // ... existing node types ...
  typedVar: TypedVarNode,
  struct: StructNode,
  write: WriteNode,
  readWithParam: ReadWithParamNode,
}; 