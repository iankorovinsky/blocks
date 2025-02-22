import json
from typing import List, Dict, Any
import time
import os

class ContractBuilder:
    def __init__(self, jsonData: Dict[str, Any]):
        self.contractName = ""
        self.functions = []
        self.storageVars = []
        self.interfaces = []
        self.structs = []
        self.jsonData = jsonData

    def loadJson(self, jsonFilePath: str) -> Dict:
        try:
            with open(jsonFilePath, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            raise FileNotFoundError(f"Could not find JSON file at: {jsonFilePath}")
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON format in file: {jsonFilePath}")
    
    def setName(self, name: str):
        self.contractName = name

    def addFunction(self, functionData: dict):
        self.functions.append(functionData)
    
    def buildInterfaceBlock(self) -> str:
        if not self.contractName:
            raise ValueError("Contract name must be set before building interface block")
        
        interfaceName = f"I{self.contractName}"
        
        interfaceBlock = [
            "#[starknet::interface]",
            f"trait {interfaceName}<TContractState> {{",
        ]
        
        for func in self.functions:
            template = func['template']
            if template:
                signature = template[0].strip()
                signature = signature.replace("ContractState", "TContractState")
                signature = signature.rstrip(" {")
                signature = f"\t{signature};"
                interfaceBlock.append(signature)
        
        interfaceBlock.append("}")
        
        return "\n".join(interfaceBlock)

    def buildContractBlock(self) -> str:
        if not self.contractName:
            raise ValueError("Contract name must be set before building contract block")
        
        contractParts = [
            "#[starknet::contract]",
            f"mod {self.contractName} {{",
        ]

        hasRead = any(func.get('template', [None])[0].strip().startswith('fn get') for func in self.functions)
        hasWrite = any(func.get('template', [None])[0].strip().startswith(('fn set', 'fn increment', 'fn decrement')) for func in self.functions)

        if hasRead or hasWrite:
            storageTraits = []
            if hasRead:
                storageTraits.append("StoragePointerReadAccess")
            if hasWrite:
                storageTraits.append("StoragePointerWriteAccess")
            contractParts.append(f"\tuse core::starknet::storage::{{{', '.join(storageTraits)}}};")

        contractParts.append("")
        storageBlock = self.buildStorageBlock()
        indentedStorage = "\t" + storageBlock.replace("\n", "\n\t")
        contractParts.append(indentedStorage)
        contractParts.append("")
        
        implBlock = self.buildImplementationBlock()
        contractParts.append(implBlock)
        
        contractParts.append("}")
        
        return "\n".join(contractParts)
    
    def buildStorageBlock(self):
        storageBlock = [
            "#[storage]",
            "struct Storage {",
        ]
        
        if self.storageVars:
            storageBlock.extend(f"\t{var}" for var in self.storageVars)
            
        storageBlock.append("}")
        
        return "\n".join(storageBlock)

    def buildImplementationBlock(self) -> str:
        if not self.contractName:
            raise ValueError("Contract name must be set before building implementation block")
            
        implParts = [
            "\t#[abi(embed_v0)]",
            f"\timpl {self.contractName} of super::I{self.contractName}<ContractState> {{",
        ]
        if self.functions:
            for func in self.functions:
                implParts.extend(["\t\t" + line for line in func['template']])
        
        implParts.append("\t}")
        
        return "\n".join(implParts)

    def getStructFields(self, structNode: Dict) -> List[Dict]:
        edges = self.getNodeEdges(structNode['id'])
        fields = []
        
        for connectedNodeId in edges['connectedNodes']:
            connectedNode = next(
                (node for node in self.jsonData['nodeData'] if node['id'] == connectedNodeId), 
                None
            )
            
            if not connectedNode:
                continue

            # NEED TO CHANGE THIS TO TYPED VARIABLE    
            if connectedNode['data']['type'] == 'PRIM_TYPE':
                fields.append({
                    'name': connectedNode['data'].get('name', f'field_{len(fields)}'),
                    'type': self.getPrimitiveType(connectedNode)
                })
                
        return fields
    
    def buildEventEnum(self) -> str:
        eventNodes = self.getNodesByType('EVENT')
        if not eventNodes:
            return ""
            
        enumBlock = [
            "#[derive(Drop, starknet::Event)]",
            "enum Event {",
        ]
        
        for node in eventNodes:
            eventName = node['data'].get('name', 'UnnamedEvent')
            structName = self.getConnectedStructName(node['id'])
            if structName:
                enumBlock.append(f"\t{eventName}: {structName},")
        
        enumBlock.append("}")
        return "\n".join(enumBlock)


    def build(self):
        # Combine all components into a complete contract
        contract_parts = []

        # Add struct definitions if any exist
        structs = self.buildStructs()
        if structs:
            contract_parts.append(structs)
            contract_parts.append("")  # Add blank line for separation

        # Add the interface block
        contract_parts.append(self.buildInterfaceBlock())
        
        # Add the contract block (includes storage block and implementation block)
        contract_parts.append(self.buildContractBlock())
        return "\n\n".join(contract_parts)

    def parseNodes(self) -> List[Dict]:
        if 'nodeData' not in self.jsonData:
            raise KeyError("JSON data does not contain 'nodeData' key")
        return self.jsonData['nodeData']

    def getNodesByType(self, nodeType: str) -> List[Dict]:
        nodes = self.parseNodes()
        return [node for node in nodes if node['data']['type'] == nodeType]

    def getNodeEdges(self, nodeId: str) -> Dict[str, List[Dict]]:
        if 'edgeData' not in self.jsonData:
            raise KeyError("JSON data does not contain 'edgeData' key")
            
        edges = self.jsonData['edgeData']
        connectedEdges = [edge for edge in edges if edge['source'] == nodeId or edge['target'] == nodeId]
        
        return {
            'connections': connectedEdges,
            'connectedNodes': [
                edge['target'] if edge['source'] == nodeId else edge['source']
                for edge in connectedEdges
            ]
        }
    
    def getPrimitiveType(self, primitiveNode: Dict) -> str:
        if primitiveNode['data']['type'] != 'PRIM_TYPE':
            raise ValueError(f"Node {primitiveNode['id']} is not a primitive type node")
        
        return primitiveNode['data']['identifier']

    def getFunctionName(self, functionNode: Dict) -> str:
        if functionNode['data']['type'] != "FUNCTION":
            raise ValueError(f"Node {functionNode['id']} is not a function node")
        return functionNode['data']['name']
    
    def getStorageVarName(self, storageVarNode) -> str:
        storageVar = storageVarNode.get('data', {}).get('storage_variable', '')
        
        if not storageVar:
            raise ValueError("Storage variable name is required")
        
        cleanName = ''.join(c for c in storageVar if c.isalnum() or c == '_')
        
        if cleanName[0].isdigit():
            cleanName = 'var_' + cleanName
            
        return cleanName
    
    def getStorageVarType(self, storageVarNode) -> str:
        edges = self.getNodeEdges(storageVarNode['id'])

        for connectedNodeId in edges['connectedNodes']:
            connectedNode = next(
                (node for node in self.jsonData['nodeData'] if node['id'] == connectedNodeId), 
                None
            )
            
            if not connectedNode:
                continue

            if connectedNode['data']['type'] == 'PRIM_TYPE':
                return self.getPrimitiveType(connectedNode)
            elif connectedNode['data']['type'] == 'COMPOUND_TYPE':
                return connectedNode['data']['primitiveType']
            elif connectedNode['data']['type'] == 'STRUCT':
                return connectedNode['data'].get('name', 'UnnamedStruct')
   
        raise ValueError(f"No type definition found for storage variable {storageVarNode['id']}")

    
    
    def generateFunctionWithReturn(self, languageJson, functionName, storageNode, params):
        template = languageJson["type"]["FUNCTION"].get('GET', {})
        if not template:
            raise ValueError(f"No template found for function: {functionName}")
        
        storageVarName = self.getStorageVarName(storageNode)
        storageVarType = self.getStorageVarType(storageNode)
        
        functionData = template.copy()
        
        processedTemplate = []
        for line in template['template']:
            line = line.replace("{functionName}", functionName)
            line = line.replace("{storageVarName}", storageVarName)
            line = line.replace("{storageVarType}", storageVarType)
            
            if params:
                for key, value in params.items():
                    line = line.replace(f"{{{key}}}", value)
            
            processedTemplate.append(line)
        
        functionData['template'] = processedTemplate
        self.addFunction(functionData)
        return "\n".join(processedTemplate)

    def generateFunction(self, languageJson, functionName, storageNode, params):
        template = languageJson["type"]["FUNCTION"].get('SET', {})
        if not template:
            raise ValueError(f"No template found for function: {functionName}")
        
        storageVarName = self.getStorageVarName(storageNode)
        storageVarType = self.getStorageVarType(storageNode)
        
        functionData = template.copy()
        
        processedTemplate = []
        for line in template['template']:
            line = line.replace("{functionName}", functionName)
            line = line.replace("{storageVarName}", storageVarName)
            line = line.replace("{storageVarRype}", storageVarType)
            
            if params:
                for key, value in params.items():
                    line = line.replace(f"{{{key}}}", value)
            
            processedTemplate.append(line)
        
        functionData['template'] = processedTemplate
        self.addFunction(functionData)
        return "\n".join(processedTemplate)

    def generateIncrementFunction(self, languageJson, functionName, storageNode, amount):
        template = languageJson["type"]["FUNCTION"].get('INCREMENT', {})
        if not template:
            raise ValueError(f"No template found for function: {functionName}")
        
        storageVarName = self.getStorageVarName(storageNode)
        storageVarType = self.getStorageVarType(storageNode)
        
        functionData = template.copy()
        
        processedTemplate = []
        for line in template['template']:
            line = line.replace("{functionName}", functionName)
            line = line.replace("{storageVarName}", storageVarName)
            line = line.replace("{storageVarType}", storageVarType)
            line = line.replace("{amount}", amount)
            
            processedTemplate.append(line)
        
        functionData['template'] = processedTemplate
        self.addFunction(functionData)
        return "\n".join(processedTemplate)

    def generateDecrementFunction(self, languageJson, functionName, storageNode, amount):
            template = languageJson["type"]["FUNCTION"].get('DECREMENT', {})
            if not template:
                raise ValueError(f"No template found for function: {functionName}")
            
            storageVarName = self.getStorageVarName(storageNode)
            storageVarType = self.getStorageVarType(storageNode)
            
            functionData = template.copy()
            
            processedTemplate = []
            for line in template['template']:
                line = line.replace("{functionName}", functionName)
                line = line.replace("{storageVarName}", storageVarName)
                line = line.replace("{storageVarType}", storageVarType)
                line = line.replace("{amount}", amount)
                
                processedTemplate.append(line)
            
            functionData['template'] = processedTemplate
            self.addFunction(functionData)
            return "\n".join(processedTemplate)

    def generateFunctions(self, languageJson):
        functionNodes = self.getNodesByType('FUNCTION')
        
        for functionNode in functionNodes:
            identifier = functionNode.get('data', {}).get('identifier')
            function_name = functionNode.get('data', {}).get('name', 'unnamed_function')
            edges = self.getNodeEdges(functionNode['id'])
            
            storageNode = None
            for connectedNodeId in edges['connectedNodes']:
                node = next(
                    (node for node in self.jsonData.get('nodeData', [])
                    if node.get('id') == connectedNodeId and 
                        node.get('data', {}).get('type') == 'STORAGE_VAR'),
                    None
                )
                if node:
                    storageNode = node
                    break
            
            if not storageNode:
                print(f"Warning: No storage node found for function {functionNode.get('id')}")
                continue

            params = {}
            for connectedNodeId in edges['connectedNodes']:
                paramNode = next(
                    (node for node in self.jsonData.get('nodeData', [])
                    if node.get('id') == connectedNodeId and 
                        node.get('data', {}).get('type') == 'PRIM_TYPE'),
                    None
                )
                
                if paramNode:
                    paramName = paramNode['data'].get('name', 'param')
                    paramType = self.getPrimitiveType(paramNode)
                    params[paramName] = paramType
            
            if identifier == 'SET':
                self.generateFunction(languageJson, function_name, storageNode, params)
            elif identifier == 'GET':
                self.generateFunctionWithReturn(languageJson, function_name, storageNode, params)
            elif identifier == 'INCREMENT':
                amount = functionNode.get('data', {}).get('amount', '1')
                self.generateIncrementFunction(
                    languageJson,
                    function_name,
                    storageNode,
                    amount
                )
            elif identifier == 'DECREMENT':
                amount = functionNode.get('data', {}).get('amount', '1')
                self.generateDecrementFunction(
                    languageJson,
                    function_name,
                    storageNode,
                    amount
                )
                
    def generateStorageVars(self):
        storageNodes = self.getNodesByType('STORAGE_VAR')
        for node in storageNodes:
            storageVarName = self.getStorageVarName(node)
            storageVarType = self.getStorageVarType(node)
            self.storageVars.append(f"{storageVarName}: {storageVarType},")
    
    def invoke(self, contractName: str):
        languageMap = self.loadJson('language.json')

        self.setName(contractName)
        
        self.generateStorageVars()

        self.generateFunctions(languageMap)

        finalContract = self.build()

        outputFilePath = f'src/lib.cairo'
        
        if os.path.exists(outputFilePath):
            os.remove(outputFilePath)

        with open(outputFilePath, 'w') as file:
            file.write(finalContract)
            
        print(f"Contract written to {outputFilePath}")

        return outputFilePath
        
        # print(finalContract)

if __name__ == "__main__":
    # Create an empty dictionary as initial jsonData
    builder = ContractBuilder({})
    builder.jsonData = builder.loadJson('sample4.json')
    
    # You can change this to any contract name you want
    builder.invoke("MyContract")