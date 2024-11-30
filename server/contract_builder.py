import json

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
    
def generate_function_with_return(language_json, function_name, return_type, params):
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
    template_str = template_str.replace("{return_type}", return_type)
    
    if params:
        # Replace other placeholders
        for key, value in params.items():
            template_str = template_str.replace(f"{{{key}}}", value)
    
    contract_builder.add_function(template_str)
    return template_str

def generate_function(language_json, function_name, params):
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
    
    if params:
        # Replace other placeholders
        for key, value in params.items():
            template_str = template_str.replace(f"{{{key}}}", value)
    
    contract_builder.add_function(template_str)
    return template_str


def generate_contract():
    return contract_builder.build()

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
    
    # Generate multiple functions
    generate_function_with_return(language_map, 'get', 'felt252', params1)
    generate_function(language_map, 'set', params2)
    
    # Get the complete contract
    final_contract = generate_contract()
    print(final_contract)

if __name__ == "__main__":
    main()