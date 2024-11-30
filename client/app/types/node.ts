import TextNode from "../../components/TextNode";
import SetFunctionNode from "../../components/SetFunctionNode";
import StorageNode from "@/components/StorageNode";
import PrimitiveNode from "@/components/PrimitiveNode";
import CompoundNode from "@/components/CompoundNode";
import GetFunctionNode from "@/components/GetFunctionNode";

export const nodeTypes = {
  textUpdater: TextNode,
  setFunction: SetFunctionNode,
  storage: StorageNode,
  primitive: PrimitiveNode,
  compound: CompoundNode,
  getFunction: GetFunctionNode,
};
