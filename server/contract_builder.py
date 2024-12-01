import json
from typing import List, Dict

class ContractBuilder:
    def __init__(self, json_file_path: str):
        self.contract_name = ""
        self.functions = []
        self.storage_vars = []
        self.interfaces = []
        self.json_data = self._load_json(json_file_path)

    def _load_json(self, json_file_path: str) -> Dict:
        """Load JSON file and store its content"""
        try:
            with open(json_file_path, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            raise FileNotFoundError(f"Could not find JSON file at: {json_file_path}")
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON format in file: {json_file_path}")
    
    # We need this added to the frontend its not in the json
    def set_name(self, name: str):
        self.contract_name = name

    def add_function(self, function_data: dict):
        self.functions.append(function_data)
    
    def build_interface_block(self) -> str:
        """Builds the interface section of the contract."""
        if not self.contract_name:
            raise ValueError("Contract name must be set before building interface block")
        
        interface_name = f"I{self.contract_name}"
        
        # Start the interface block
        interface_block = [
            "#[starknet::interface]",
            f"trait {interface_name}<TContractState> {{",
        ]
        
        # Add function declarations from templates
        for func in self.functions:
            template = func['template']
            if template:
                # Get just the function signature from the first line
                signature = template[0].strip()
                # Replace ContractState with TContractState
                signature = signature.replace("ContractState", "TContractState")
                # Remove the opening brace if it exists
                signature = signature.rstrip(" {")
                # Add semicolon
                signature = f"\t{signature};"
                interface_block.append(signature)
        
        # Close the interface block
        interface_block.append("}")
        
        return "\n".join(interface_block)

    def build_contract_block(self) -> str:
        """Builds the main contract block including storage and implementation."""
        if not self.contract_name:
            raise ValueError("Contract name must be set before building contract block")
        
        # Start the contract block
        contract_parts = [
            "#[starknet::contract]",
            f"mod {self.contract_name} {{",
            "\tuse core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};",
            ""
        ]
        # Add storage block inside the contract
        storage_block = self.build_storage_block()
        # Indent the storage block lines
        indented_storage = "\t" + storage_block.replace("\n", "\n\t")
        contract_parts.append(indented_storage)
        contract_parts.append("")  # Add empty line for spacing
        
        # Add implementation block
        impl_block = self.build_implementation_block()
        contract_parts.append(impl_block)
        
        # Close the contract block
        contract_parts.append("}")
        
        return "\n".join(contract_parts)
    
    def build_storage_block(self):
        """Build the storage block structure"""
        storage_block = [
            "#[storage]",
            "struct Storage {",
        ]
        
        if self.storage_vars:
            storage_block.extend(f"\t{var}" for var in self.storage_vars)
            
        storage_block.append("}")
        
        return "\n".join(storage_block)

    def build_implementation_block(self) -> str:
        if not self.contract_name:
            raise ValueError("Contract name must be set before building implementation block")
            
        impl_parts = [
            "\t#[abi(embed_v0)]",
            f"\timpl {self.contract_name} of super::I{self.contract_name}<ContractState> {{",
        ]
        # Add all functions - extract the template strings from the function dictionaries
        if self.functions:
            for func in self.functions:
                # Add two levels of indentation for function content
                impl_parts.extend(["\t\t" + line for line in func['template']])
        
        # Add closing brace with one level of indentation
        impl_parts.append("\t}")
        
        return "\n".join(impl_parts)

    def build(self):
        # Combine all components into a complete contract
        contract_parts = []
        
        # Add the interface block
        contract_parts.append(self.build_interface_block())
        # Add the contract block (includes storage block and implementation block)
        contract_parts.append(self.build_contract_block())
        return "\n\n".join(contract_parts)
    
    # ------------------------------------------------------------------------------------------------
    # Helper functions
    def parse_nodes(self) -> List[Dict]:
        """Get all nodes from the loaded JSON"""
        if 'nodeData' not in self.json_data:
            raise KeyError("JSON data does not contain 'nodeData' key")
        return self.json_data['nodeData']
    

    def get_nodes_by_type(self, node_type: str) -> List[Dict]:
        """Get all nodes of a specific type"""
        nodes = self.parse_nodes()
        return [node for node in nodes if node['data']['type'] == node_type]

    def get_node_edges(self, node_id: str) -> Dict[str, List[Dict]]:
        """Get all edges connected to a specific node, treating the graph as undirected"""
        if 'edgeData' not in self.json_data:
            raise KeyError("JSON data does not contain 'edgeData' key")
            
        edges = self.json_data['edgeData']
        connected_edges = [edge for edge in edges if edge['source'] == node_id or edge['target'] == node_id]
        
        return {
            'connections': connected_edges,
            'connected_nodes': [
                edge['target'] if edge['source'] == node_id else edge['source']
                for edge in connected_edges
            ]
        }
    
    def get_primitive_type(self, primitive_node: Dict) -> str:
        """Extract the primitive type from a primitive node"""
        if primitive_node['data']['type'] != 'PRIM_TYPE':
            raise ValueError(f"Node {primitive_node['id']} is not a primitive type node")
        
        return primitive_node['data']['identifier']

    def get_function_name(self, function_node: Dict) -> str:
        """Get the name of a function node""" 
        if function_node['data']['type'] != "FUNCTION":
            raise ValueError(f"Node {function_node['id']} is not a function node")
        return function_node['data']['name']
    
    def get_storage_var_name(self, storage_var_node) -> str:
        """Extract the storage variable name from a storage node"""
        # Get the storage variable name from the node data
        storage_var = storage_var_node.get('data', {}).get('storage_variable', '')
        
        # If no name is provided or it's empty, raise an error
        if not storage_var:
            raise ValueError("Storage variable name is required")
        
        # Remove any special characters and spaces, keeping alphanumeric and underscores
        # This ensures the name is valid in Cairo
        clean_name = ''.join(c for c in storage_var if c.isalnum() or c == '_')
        
        # Ensure the name starts with a letter
        if clean_name[0].isdigit():
            clean_name = 'var_' + clean_name
            
        return clean_name
    
    def get_storage_var_type(self, storage_var_node) -> str:
        edges = self.get_node_edges(storage_var_node['id'])

         # Look through all connected nodes for type definitions
        for connected_node_id in edges['connected_nodes']:
            # Find the connected node in nodeData
            connected_node = next(
                (node for node in self.json_data['nodeData'] if node['id'] == connected_node_id), 
                None
            )
            
            if not connected_node:
                continue

            # Check if this is a type node
            if connected_node['data']['type'] == 'PRIM_TYPE':
                return self.get_primitive_type(connected_node)
            elif connected_node['data']['type'] == 'COMPOUND_TYPE':
                return connected_node['data']['primitiveType']
   
        raise ValueError(f"No type definition found for storage variable {storage_var_node['id']}")


        
    # ------------------------------------------------------------------------------------------------  
    # Generate smart contract
    def generate_function_with_return(self, language_json, function_name, storage_node, params):
        template = language_json["type"]["FUNCTION"].get('GET', {})
        if not template:
            raise ValueError(f"No template found for function: {function_name}")
        
        # Get storage variable details from the node
        storage_var_name = self.get_storage_var_name(storage_node)
        storage_var_type = self.get_storage_var_type(storage_node)
        
        # Create a copy of the template
        function_data = template.copy()
        
        # Process the template strings
        processed_template = []
        for line in template['template']:
            line = line.replace("{function_name}", function_name)
            line = line.replace("{storage_var_name}", storage_var_name)
            line = line.replace("{storage_var_type}", storage_var_type)
            
            if params:
                for key, value in params.items():
                    line = line.replace(f"{{{key}}}", value)
            
            processed_template.append(line)
        
        function_data['template'] = processed_template
        self.add_function(function_data)
        return "\n".join(processed_template)

    def generate_function(self, language_json, function_name, storage_node, params):
        template = language_json["type"]["FUNCTION"].get('SET', {})
        if not template:
            raise ValueError(f"No template found for function: {function_name}")
        
        # Get storage variable details from the node
        storage_var_name = self.get_storage_var_name(storage_node)
        storage_var_type = self.get_storage_var_type(storage_node)
        
        # Create a copy of the template
        function_data = template.copy()
        
        # Process the template strings
        processed_template = []
        for line in template['template']:
            line = line.replace("{function_name}", function_name)
            line = line.replace("{storage_var_name}", storage_var_name)
            line = line.replace("{storage_var_type}", storage_var_type)
            
            if params:
                for key, value in params.items():
                    line = line.replace(f"{{{key}}}", value)
            
            processed_template.append(line)
        
        function_data['template'] = processed_template
        self.add_function(function_data)
        return "\n".join(processed_template)
    
    def generate_functions(self, language_json):
        """Generate all functions based on function nodes in the JSON data
        Args:
            language_json: The language template data
        """
        function_nodes = self.get_nodes_by_type('FUNCTION')
        
        for function_node in function_nodes:
            # Get the function identifier (SET or RETURN)
            identifier = function_node.get('data', {}).get('identifier')
            
            # Get edges for this function node
            edges = self.get_node_edges(function_node['id'])
            
            # Find the storage node among connected nodes
            storage_node = None
            for connected_node_id in edges['connected_nodes']:
                node = next(
                    (node for node in self.json_data.get('nodeData', [])
                    if node.get('id') == connected_node_id and 
                        node.get('data', {}).get('type') == 'STORAGE_VAR'),
                    None
                )
                if node:
                    storage_node = node
                    break
            
            if not storage_node:
                print(f"Warning: No storage node found for function {function_node.get('id')}")
                continue
            # Get parameters from incoming nodes
            params = {
                "function_name": function_node.get('data', {}).get('name', 'unnamed_function')
            }
            
            # Look for parameter nodes among connected nodes
            for connected_node_id in edges['connected_nodes']:
                param_node = next(
                    (node for node in self.json_data.get('nodeData', [])
                    if node.get('id') == connected_node_id and 
                        node.get('data', {}).get('type') == 'PRIM_TYPE'),
                    None
                )
                
                if param_node:
                    param_name = param_node['data'].get('name', 'param')
                    param_type = self.get_primitive_type(param_node)
                    params[param_name] = param_type
            
            # Generate the appropriate function based on identifier
            if identifier == 'SET':
                self.generate_function(language_json, 'set', storage_node, params)
            elif identifier == 'GET':
                self.generate_function_with_return(language_json, 'get', storage_node, params)
    
    def generate_storage_vars(self):
        """Generate storage variables from the JSON data"""
        storage_nodes = self.get_nodes_by_type('STORAGE_VAR')
        for node in storage_nodes:
            storage_var_name = self.get_storage_var_name(node)
            storage_var_type = self.get_storage_var_type(node)
            self.storage_vars.append(f"{storage_var_name}: {storage_var_type},")

    
    


# Create a global contract builder instance
contract_builder = ContractBuilder('sample3.json')
    
def main():
    language_map = contract_builder._load_json('language.json')
    
    # Add this line to set the contract name while we don't have a frontend for it
    contract_builder.set_name("MyContract")
    
    contract_builder.generate_storage_vars()

    # Generate all functions - this populates self.functions
    contract_builder.generate_functions(language_map)

    final_contract = contract_builder.build()

    # Define the output file path
    output_file_path = '/home/appuser/blocks-1/server/src/lib.cairo'

    # Write the final contract to the specified file
    with open(output_file_path, 'w') as file:
        file.write(final_contract)
    
    print(f"Contract written to {output_file_path}")
    
    print(final_contract)

if __name__ == "__main__":
    main()