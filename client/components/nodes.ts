import { StructNode } from "./StructNode";
import { WriteNode } from "./WriteNode";
import { ReadWithParamNode } from "./ReadWithParamNode";
import AdditionNode from "./AdditionNode";
import SubtractionNode from "./SubtractionNode";
import AssertNode from "./AssertNode"; 
import CompoundNode from "./CompoundNode";
import DecrementFunctionNode from "./DecrementFunctionNode";
import EventNode from "./EventNode";
import FunctionCallNode from "./FunctionCallNode";
import GetFunctionNode from "./GetFunctionNode";
import GetCallerAddressNode from "./GetCallerAddressNode";
import IncrementNode from "./IncrementNode";
import IsNotZeroCondition from "./IsNotZeroCondition";
import LegacyNode from "./LegacyNode";
import PrimitiveNode from "./PrimitiveNode";
import ReadFunctionNode from "./ReadFunctionNode";
import SetFunctionNode from "./SetFunctionNode";
import StorageNode from "./StorageNode";
import EnumNode from "./EnumNode";
import TypedVariableNode from "./TypedVariableNode";
import WriteWithParamsNode from "./WriteWithParamsNode";
import ReadWithParamsNode from "./ReadWithParamsNode";

// ... existing imports ...

export const nodeTypes = {
  // ... existing node types ...
  typedVariable: TypedVariableNode,
  struct: StructNode,
  write: WriteNode,
  readWithParam: ReadWithParamNode,
  addition: AdditionNode,
  subtraction: SubtractionNode,
  assert: AssertNode,
  compound: CompoundNode,
  decrement: DecrementFunctionNode,
  event: EventNode,
  functionCall: FunctionCallNode,
  getFunction: GetFunctionNode,
  getCallerAddress: GetCallerAddressNode,
  increment: IncrementNode,
  isNotZero: IsNotZeroCondition,
  legacy: LegacyNode,
  primitive: PrimitiveNode,
  readFunction: ReadFunctionNode,
  setFunction: SetFunctionNode,
  storage: StorageNode,
  enum: EnumNode,
  writeWithParams: WriteWithParamsNode,
  readWithParams: ReadWithParamsNode,
}; 
