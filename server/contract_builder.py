import json
from typing import List, Dict

class ContractBuilder:
    def __init__(self, json_file_path: str):
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
    
    
    def add_function(self, function_code):
        self.functions.append(function_code)
    
    def build(self):
        # Combine all components into a complete contract
        contract_parts = []
        if self.storage_vars:
            contract_parts.extend(self.storage_vars)
        if self.interfaces:
            contract_parts.extend(self.interfaces)
        if self.functions:
            contract_parts.extend(self.functions)
        
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
        return [node for node in nodes if node['type'] == node_type]

    def get_node_edges(self, node_id: str) -> Dict[str, List[Dict]]:
        """Get all edges connected to a specific node"""
        if 'edgeData' not in self.json_data:
            raise KeyError("JSON data does not contain 'edgeData' key")
            
        edges = self.json_data['edgeData']
        return {
            'incoming': [edge for edge in edges if edge['target'] == node_id],
            'outgoing': [edge for edge in edges if edge['source'] == node_id]
        }

    def get_function_label(self, function_id: str) -> str:
        """Get the label of a function node"""
        nodes = self.parse_nodes()
        for node in nodes:
            if node['id'] == function_id:
                if node['data']['type'] != "FUNCTION":
                    raise ValueError(f"Node {function_id} is not a function node")
                return node['data']['label']
                
        raise ValueError(f"No node found with ID: {function_id}")
    # ------------------------------------------------------------------------------------------------  
    # Generate function code
    def generate_function_with_return(self, language_json, function_name, storage_var, storage_var_type, params):
        template = language_json["type"]["FUNCTION"].get('SET', {}).get("template", [])
        if not template:
            raise ValueError(f"No template found for function: {function_name}")
        
        template_str = "\n".join(template)
        template_str = template_str.replace("{function_name}", function_name)
        template_str = template_str.replace("{storage_var}", storage_var)
        template_str = template_str.replace("{storage_var_type}", storage_var_type)
        
        if params:
            for key, value in params.items():
                template_str = template_str.replace(f"{{{key}}}", value)
        
        self.add_function(template_str)
        return template_str

    def generate_function(self, language_json, function_name, storage_var, storage_var_type, params):
        template = language_json["type"]["FUNCTION"].get('GET', {}).get("template", [])
        if not template:
            raise ValueError(f"No template found for function: {function_name}")
        
        template_str = "\n".join(template)
        template_str = template_str.replace("{function_name}", function_name)
        template_str = template_str.replace("{storage_var}", storage_var)
        template_str = template_str.replace("{storage_var_type}", storage_var_type)
        
        if params:
            for key, value in params.items():
                template_str = template_str.replace(f"{{{key}}}", value)
        
        self.add_function(template_str)
        return template_str


# Create a global contract builder instance
contract_builder = ContractBuilder('sample.json')
    
def main():
    language_map = contract_builder._load_json('language.json')
    
    params1 = {
        "function_name": "get",
        "param1": "u256",
        "param2": "u128"
    }
    
    # Now called as instance methods
    contract_builder.generate_function_with_return(language_map, 'get', 'a', 'felt252', params1)
    final_contract = contract_builder.build()

    print(final_contract)


if __name__ == "__main__":
    main()