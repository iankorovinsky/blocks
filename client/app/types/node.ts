import TextNode from "../../components/TextNode";
import SetFunctionNode from "../../components/SetFunctionNode";
import StorageNode from "@/components/StorageNode";
import PrimitiveNode from "@/components/PrimitiveNode";
import CompoundNode from "@/components/CompoundNode";

export const nodeTypes = {
  textUpdater: TextNode,
  setFunction: SetFunctionNode,
  storage: StorageNode,
  primitive: PrimitiveNode,
  compound: CompoundNode,
};
