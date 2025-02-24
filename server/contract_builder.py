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
        

        # This is suspicious TODO 
        for func in self.functions:
            template = func['template']
            if not template:
                continue
                
            # Get all lines that aren't just a brace or empty
            code_lines = [line.strip() for line in template if line.strip() and line.strip() not in ['{', '}']]
            if not code_lines:
                continue
                
            # Get the function signature line
            signature_line = code_lines[0]
            
            # Extract function name and parameters
            fn_start = signature_line.find('fn ')
            params_start = signature_line.find('(', fn_start)
            params_end = signature_line.find(')', params_start)
            
            if fn_start < 0 or params_start < 0 or params_end < 0:
                continue
                
            # Get the function name
            fn_name = signature_line[fn_start:params_start].strip()
            
            # Get and process parameters
            params = signature_line[params_start+1:params_end].strip()
            param_list = [p.strip() for p in params.split(',') if p.strip()]
            
            # Replace ContractState with TContractState in self parameter
            if param_list and 'self' in param_list[0]:
                param_list[0] = param_list[0].replace('ContractState', 'TContractState')
            
            # Reconstruct the function signature
            params = ', '.join(param_list)
            
            # Check if there's a return type
            return_type = ""
            if " -> " in signature_line:
                return_type = " -> " + signature_line.split(" -> ")[1].strip().rstrip('{').strip()
            
            signature = f"\t{fn_name}({params}){return_type};"
            interfaceBlock.append(signature)

            ## Until here
        
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
        
        # Add struct definitions if any exist
        structs = self.buildStructs()
        if structs:
            indentedStructs = "\t" + structs.replace("\n", "\n\t")
            contractParts.append(indentedStructs)
            contractParts.append("")

        # Find and add constructor if it exists
        constructorNodes = [
            node for node in self.jsonData.get('nodeData', [])
            if node.get('data', {}).get('type') == 'FUNCTION' and 
            node.get('data', {}).get('identifier') == 'CONSTRUCTOR'
        ]
        if constructorNodes:
            constructor = self.generateConstructor(constructorNodes[0])
            indentedConstructor = "\t" + constructor.replace("\n", "\n\t")
            contractParts.append(indentedConstructor)
            contractParts.append("")

        # Add event enum if any events exist
        events = self.buildEventEnum()
        if events:
            indentedEvents = "\t" + events.replace("\n", "\n\t")
            contractParts.append(indentedEvents)
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
                if not func.get('is_constructor', False):  # Skip constructor in implementation block
                    implParts.extend(["\t\t" + line for line in func['template']])
        
        implParts.append("\t}")
        
        return "\n".join(implParts)

    def getStructFields(self, structNode: Dict) -> List[Dict]:
        edges = self.getNodeEdges(structNode['id'])
        fields = []
        
        for connectedNodeId in edges['connectedNodes']:
            # First find the TypedVariable node
            typedVarNode = next(
                (node for node in self.jsonData['nodeData'] if node['id'] == connectedNodeId), 
                None
            )
            
            if not typedVarNode or typedVarNode['data']['type'] != 'TYPED_VAR':
                continue
            
            # Get the edges of the TypedVariable node to find its connected primitive type
            typedVarEdges = self.getNodeEdges(typedVarNode['id'])
            
            for primitiveNodeId in typedVarEdges['connectedNodes']:
                primitiveNode = next(
                    (node for node in self.jsonData['nodeData'] if node['id'] == primitiveNodeId), 
                    None
                )
                
                if primitiveNode and primitiveNode['data']['type'] == 'PRIM_TYPE':
                    fields.append({
                        'name': typedVarNode['data'].get('label', f'field_{len(fields)}'),
                        'type': self.getPrimitiveType(primitiveNode),
                        'is_key': typedVarNode['data'].get('is_key', False) # NOT SUPPORTED YET NEED TO UPDATE FE
                    })
                    break  # Found the primitive type for this typed variable
                
        return fields
    
    def buildEventEnum(self) -> str:
        eventNodes = self.getNodesByType('EVENT')
        if not eventNodes:
            return ""
            
        enumBlock = [
            "#[event]",
            "#[derive(Drop, starknet::Event)]",
            "pub enum Event {",
        ]
        
        for node in eventNodes:
            structName = self.getConnectedStructName(node['id'])
            if structName:
                # Use the struct name as the event name
                enumBlock.append(f"\t{structName}: {structName},")
        
        enumBlock.append("}")
        return "\n".join(enumBlock)
    
    def getConnectedStructName(self, nodeId: str) -> str:
        edges = self.getNodeEdges(nodeId)
        for connectedNodeId in edges['connectedNodes']:
            node = next(
                (node for node in self.jsonData['nodeData'] if node['id'] == connectedNodeId), 
                None
            )
            if node and node['data']['type'] == 'STRUCT':
                return node['data'].get('name', 'UnnamedStruct')
        return ""
    
    def generateEmitEventFunction(self, eventNode: Dict) -> str:
        structName = self.getConnectedStructName(eventNode['id'])
        
        if not structName:
            raise ValueError(f"Event must be connected to a struct")
            
        # Get the struct node to access its fields - TODO very inefficient
        structNode = next(
            (node for node in self.jsonData['nodeData'] 
             if node['data']['type'] == 'STRUCT' and node['data'].get('name') == structName),
            None
        )
        
        if not structNode:
            raise ValueError(f"Could not find struct {structName}")
            
        fields = self.getStructFields(structNode)
        
        # Create parameters from struct fields
        params = [f"{field['name']}: {field['type']}" for field in fields]
        params_str = ", ".join(params)
            
        template = [
            f"fn emit_{structName.lower()}(ref self: ContractState, {params_str})",
            "{",
            f"\tself.emit(Event::{structName}({structName} {{ {', '.join(field['name'] for field in fields)} }}));",
            "}"
        ]
        
        functionData = {'template': template}
        self.addFunction(functionData)
        return "\n".join(template)

    def generateConstructor(self, constructorNode: Dict) -> str:
        # Get the edges to find connected typed variables
        edges = self.getNodeEdges(constructorNode['id'])
        parameters = []
        
        # Always include self parameter
        parameters.append("ref self: ContractState")
        
        # Process each connected node
        for connectedNodeId in edges['connectedNodes']:
            # Find TypedVariable nodes
            typedVarNode = next(
                (node for node in self.jsonData['nodeData'] 
                 if node['id'] == connectedNodeId and node['data']['type'] == 'TYPED_VAR'),
                None
            )
            
            if typedVarNode:
                # Get the variable name
                varName = typedVarNode['data'].get('label', 'unnamed')
                
                # Get the type from connected primitive node
                varType = None
                varEdges = self.getNodeEdges(typedVarNode['id'])
                for typeNodeId in varEdges['connectedNodes']:
                    typeNode = next(
                        (node for node in self.jsonData['nodeData'] if node['id'] == typeNodeId),
                        None
                    )
                    if typeNode and typeNode['data']['type'] == 'PRIM_TYPE':
                        varType = self.getPrimitiveType(typeNode)
                        break
                
                if varType:
                    parameters.append(f"{varName}: {varType}")
        
        # Get code from connected code block
        code_content = ""
        for connectedNodeId in edges['connectedNodes']:
            codeNode = next(
                (node for node in self.jsonData['nodeData'] 
                 if node['id'] == connectedNodeId and node['data']['type'] == 'CODE'),
                None
            )
            if codeNode:
                code_content = codeNode['data'].get('code', "").strip()
                break
        
        # Build the constructor template
        template = [
            "#[constructor]",
            f"fn constructor({', '.join(parameters)}) {{",
            f"\t{code_content}"
            "\t",
            "}"
        ]
        
        functionData = {
            'template': template,
            'is_constructor': True
        }
        self.addFunction(functionData)
        return "\n".join(template)

    def build(self):
        # Combine all components into a complete contract
        contract_parts = []

        # Add the interface block
        contract_parts.append(self.buildInterfaceBlock())
        contract_parts.append("")  # Add blank line for separation
        
        # Add the contract block (includes storage block, structs, events, and implementation block)
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

    def generateBasicFunction(self, functionNode: Dict) -> str:
        # Get function name from node data
        function_name = functionNode['data'].get('name', 'unnamed_function')
        
        # Get parameters from node data
        parameters = functionNode['data'].get('parameters', [])
        param_str = "self: @ContractState"  # Always include self parameter
        if parameters:
            param_str += ", " + ", ".join(f"{param['name']}: {param['type']}" for param in parameters)
            
        # Get return type if present
        return_type = functionNode['data'].get('returnType', '')
        return_str = f" -> {return_type}" if return_type else ""
        
        # Get connected code node for function body
        edges = self.getNodeEdges(functionNode['id'])
        code_content = "// No code implementation provided"
        
        for connectedNodeId in edges['connectedNodes']:
            codeNode = next(
                (node for node in self.jsonData['nodeData'] 
                 if node['id'] == connectedNodeId and node['data']['type'] == 'CODE'),
                None
            )
            if codeNode:
                code_content = codeNode['data'].get('code', code_content)
                break
        
        # Build function template
        template = [
            f"fn {function_name}({param_str}){return_str} {{",
            f"    {code_content}",
            "}"
        ]
        
        functionData = {'template': template}
        self.addFunction(functionData)
        return "\n".join(template)

    def generateFunctions(self, languageJson):

        # Process standard function nodes (GET, SET, etc.)
        functionNodes = self.getNodesByType('FUNCTION')
        eventNodes = self.getNodesByType('EVENT')
        
        # Process basic function nodes
        basicFunctionNodes = [
            node for node in self.jsonData.get('nodeData', [])
            if node.get('data', {}).get('type') == 'BASIC_FUNCTION'
        ]
        
        # Generate standard functions
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
                
        # Generate basic functions
        for functionNode in basicFunctionNodes:
            self.generateBasicFunction(functionNode)
                
        # Generate event emission functions
        for eventNode in eventNodes:
            self.generateEmitEventFunction(eventNode)

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

    def buildStructs(self) -> str:
        structNodes = self.getNodesByType('STRUCT')
        if not structNodes:
            return ""
        
        structBlocks = []
        for structNode in structNodes:
            structName = structNode['data'].get('name', 'UnnamedStruct')
            fields = self.getStructFields(structNode)
            
            # Build the struct definition
            structDef = [
                "#[derive(Drop, starknet::Event)]",
                f"pub struct {structName} {{",
            ]
            
            # Add fields with their types
            for field in fields:
                structDef.append(f"\t{field['name']}: {field['type']},")
            
            structDef.append("}")
            
            # Add this struct to our collection
            structBlocks.append("\n".join(structDef))
        
        # Return all structs joined with double newlines
        return "\n\n".join(structBlocks)

if __name__ == "__main__":
    # Create an empty dictionary as initial jsonData
    builder = ContractBuilder({})
    builder.jsonData = builder.loadJson('sample8.json')
    
    # You can change this to any contract name you want
    builder.invoke("MyContract")