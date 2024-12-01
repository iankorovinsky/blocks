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
import EmitNode from "@/components/EmitNode";
import LegacyNode from "@/components/LegacyNode";

export const nodeTypes = {
  setFunction: SetFunctionNode,
  storage: StorageNode,
  primitive: PrimitiveNode,
  compound: CompoundNode,
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
  emitNode: EmitNode,
  legacyMap: LegacyNode,

};
