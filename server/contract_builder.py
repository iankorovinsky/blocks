import json
from typing import List, Dict

class ContractBuilder:
    def __init__(self):
        self.functions = []
        self.storage_vars = []
        self.interfaces = []
    
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

# Create a global contract builder instance
contract_builder = ContractBuilder()

def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)
    
def generate_function_with_return(language_json, function_name, storage_var_type, params):
    """
    Generate Cairo code for a function with a return type.
    
    Args:
        language_json: The loaded language template dictionary
        function_name: Name of the function to generate (e.g., 'set')
        params: Dictionary of parameters and their types
        return_type: The return type of the function
    """
    template = language_json["type"]["FUNCTION"].get(function_name, {}).get("template", [])
    if not template:
        raise ValueError(f"No template found for function: {function_name}")
    
    template_str = "\n".join(template)

    # Replace function name and return type
    template_str = template_str.replace("{function_name}", function_name)
    template_str = template_str.replace("{storage_var_type}", storage_var_type)
    
    if params:
        # Replace other placeholders
        for key, value in params.items():
            template_str = template_str.replace(f"{{{key}}}", value)
    
    contract_builder.add_function(template_str)
    return template_str

def generate_function(language_json, function_name, storage_var_type, params):
    """
    Generate Cairo code for a function without a return type.
    
    Args:
        language_json: The loaded language template dictionary
        function_name: Name of the function to generate (e.g., 'get')
        params: Dictionary of parameters and their types
    """
    template = language_json["type"]["FUNCTION"].get(function_name, {}).get("template", [])
    if not template:
        raise ValueError(f"No template found for function: {function_name}")
    
    template_str = "\n".join(template)

    # Replace function name and return type
    template_str = template_str.replace("{function_name}", function_name)
    template_str = template_str.replace("{storage_var_type}", storage_var_type)
    
    if params:
        # Replace other placeholders
        for key, value in params.items():
            template_str = template_str.replace(f"{{{key}}}", value)
    
    contract_builder.add_function(template_str)
    return template_str


def generate_contract():
    return contract_builder.build()

def parse_nodes_from_json(json_file_path: str) -> List[Dict]:
    """
    Parse a JSON file and extract all nodes.
    
    Args:
        json_file_path: Path to the JSON file containing node data
        
    Returns:
        List of node dictionaries
        Ex. Node ID --> node['id']
    """
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            
        if 'nodeData' not in data:
            raise KeyError("JSON file does not contain 'nodeData' key")
            
        return data['nodeData']
    except FileNotFoundError:
        raise FileNotFoundError(f"Could not find JSON file at: {json_file_path}")
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON format in file: {json_file_path}")


def get_function_nodes(json_file_path: str) -> List[Dict]:
    """
    Parse a JSON file and extract all nodes that have type "FUNCTION".
    
    Args:
        json_file_path: Path to the JSON file containing node data
        
    Returns:
        List of function node dictionaries
    """
    nodes = parse_nodes_from_json(json_file_path)
    return [node for node in nodes if node['data']['type'] == "FUNCTION"]

def get_node_edges(json_file_path: str, node_id: str) -> Dict[str, List[Dict]]:
    """
    Get all edges connected to a specific node ID, separated by incoming and outgoing edges.
    
    Args:
        json_file_path: Path to the JSON file containing edge data
        node_id: The ID of the node to find edges for
        
    Returns:
        Dictionary containing:
            'incoming': List of edges where the node is the target
            'outgoing': List of edges where the node is the source
        
        Ex. Incoming edges --> node_edges['incoming']
    """
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            
        if 'edgeData' not in data:
            raise KeyError("JSON file does not contain 'edgeData' key")
            
        edges = data['edgeData']
        connected_edges = {
            'incoming': [edge for edge in edges if edge['target'] == node_id],
            'outgoing': [edge for edge in edges if edge['source'] == node_id]
        }
        
        return connected_edges
    except FileNotFoundError:
        raise FileNotFoundError(f"Could not find JSON file at: {json_file_path}")
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON format in file: {json_file_path}")
    
def main():
    language_map = load_json('language.json')
    
    # Generate multiple functions
    params1 = {
        "function_name": "get",
        "param1": "u256",
        "param2": "u128"
    }
    
    params2 = {
        "function_name": "set",
        "param1": "u256",
        "param2": "u128"
    }
    
    # # Generate multiple functions
    # generate_function_with_return(language_map, 'get', 'felt252', params1)
    # generate_function(language_map, 'set', 'u256', params2)
    
    # # Get the complete contract
    # final_contract = generate_contract()
    # print(final_contract)

    # Example usage
    node_edges = get_node_edges('sample.json', "2")
    print("Incoming edges:", node_edges['incoming'])  # Shows edges where node 2 is the target
    print("Outgoing edges:", node_edges['outgoing'])  # Shows edges where node 2 is the source


if __name__ == "__main__":
    main()