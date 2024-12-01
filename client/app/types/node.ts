import CompoundNode from "@/components/CompoundNode";
import GetFunctionNode from "@/components/GetFunctionNode";
import PrimitiveNode from "@/components/PrimitiveNode";
import StorageNode from "@/components/StorageNode";
import SetFunctionNode from "../../components/SetFunctionNode";
import ReadFunctionNode from "../../components/ReadFunctionNode";
import IncrementFunctionNode from "../../components/IncrementFunctionNode";
import DecrementFunctionNode from "../../components/DecrementFunctionNode";
export const nodeTypes = {
  setFunction: SetFunctionNode,
  storage: StorageNode,
  primitive: PrimitiveNode,
  compound: CompoundNode,
  getFunction: GetFunctionNode,
  readFunction: ReadFunctionNode,
  incrementFunction: IncrementFunctionNode,
  decrementFunction: DecrementFunctionNode,
};
