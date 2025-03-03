import CompoundNode from "@/components/CompoundNode";
import GetFunctionNode from "@/components/GetFunctionNode";
import PrimitiveNode from "@/components/PrimitiveNode";
import StorageNode from "@/components/StorageNode";
import SetFunctionNode from "../../components/SetFunctionNode";
import BasicFunctionNode from "@/components/BasicFunctionNode";
import ReadFunctionNode from "../../components/ReadFunctionNode";
import IncrementFunctionNode from "../../components/IncrementFunctionNode";
import DecrementFunctionNode from "../../components/DecrementFunctionNode";
import AssertNode from "@/components/AssertNode";
import IsNotZeroCondition from "@/components/IsNotZeroCondition";
import FunctionCallNode from "@/components/FunctionCallNode";
import GetCallerAddressNode from "@/components/GetCallerAddressNode";
import AdditionNode from "@/components/AdditionNode";
import SubtractionNode from "@/components/SubtractionNode";
import EventNode from "@/components/EventNode";
import LegacyNode from "@/components/LegacyNode";
import EnumNode from "@/components/EnumNode";
import TypedVariableNode from "@/components/TypedVariableNode";
import WriteWithParamsNode from "@/components/WriteWithParamsNode";
import ReadWithParamsNode from "@/components/ReadWithParamsNode";
import StructNode from "@/components/StructNode";
import ConstructorNode from "@/components/ConstructorNode";
import CodeNode from "@/components/CodeNode";


export const nodeTypes = {
  setFunction: SetFunctionNode,
  storage: StorageNode,
  primitive: PrimitiveNode,
  compound: CompoundNode,
  struct: StructNode,
  getFunction: GetFunctionNode,
  basicFunction: BasicFunctionNode,
  readFunction: ReadFunctionNode,
  incrementFunction: IncrementFunctionNode,
  decrementFunction: DecrementFunctionNode,
  assert: AssertNode,
  isNotZeroCondition: IsNotZeroCondition,
  functionCall: FunctionCallNode,
  getCallerAddress: GetCallerAddressNode,
  additionNode: AdditionNode,
  subtractionNode: SubtractionNode,
  eventNode: EventNode,
  legacyMap: LegacyNode,
  enum: EnumNode,
  typedVariable: TypedVariableNode,
  writeWithParams: WriteWithParamsNode,
  readWithParams: ReadWithParamsNode,
  constructor: ConstructorNode,
  code: CodeNode,
};
