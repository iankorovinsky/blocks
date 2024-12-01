import CompoundNode from "@/components/CompoundNode";
import GetFunctionNode from "@/components/GetFunctionNode";
import PrimitiveNode from "@/components/PrimitiveNode";
import StorageNode from "@/components/StorageNode";
import SetFunctionNode from "../../components/SetFunctionNode";
import BasicFunctionNode from "@/components/BasicFunctionNode";
import ReadFunctionNode from "../../components/ReadFunctionNode";
import IncrementFunctionNode from "../../components/IncrementFunctionNode";
import DecrementFunctionNode from "../../components/DecrementFunctionNode";
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
};
