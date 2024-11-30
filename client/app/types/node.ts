import TextNode from "../../components/TextNode";
import SetFunctionNode from "../../components/SetFunctionNode";
import StorageNode from "@/components/StorageNode";
import PrimitiveNode from "@/components/PrimitiveNode";

export const nodeTypes = {
  textUpdater: TextNode,
  setFunction: SetFunctionNode,
  storage: StorageNode,
  primitive: PrimitiveNode,
};
