import { TypedVarNode } from "./TypedVarNode";
import { StructNode } from "./StructNode";
import { WriteNode } from "./WriteNode";
import { ReadWithParamNode } from "./ReadWithParamNode";
// ... existing imports ...

export const nodeTypes = {
  // ... existing node types ...
  typedVar: TypedVarNode,
  struct: StructNode,
  write: WriteNode,
  readWithParam: ReadWithParamNode,
}; 