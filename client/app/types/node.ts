import CompoundNode from "@/components/CompoundNode";
import GetFunctionNode from "@/components/GetFunctionNode";
import PrimitiveNode from "@/components/PrimitiveNode";
import StorageNode from "@/components/StorageNode";
import SetFunctionNode from "../../components/SetFunctionNode";

export const nodeTypes = {
  setFunction: SetFunctionNode,
  storage: StorageNode,
  primitive: PrimitiveNode,
  compound: CompoundNode,
  getFunction: GetFunctionNode,
};
