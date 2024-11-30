# NOT IN USE, USED TO TEST CONTRACT BUILDER
import json

def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)
    
def generate_cairo_code(language_json, type, name, params=None):
    # for example: type can be FUNCTION, name can be set, params can be {"param1": "u256", "param2": "u128"}
    # Load the template
    template = language_json["type"][type].get(name, {}).get("template", [])
    if not template:
        raise ValueError(f"No template found for {type}/{name}")
    
    # Join the template lines with newlines
    template_str = "\n".join(template)

    # Replace placeholders with actual parameters
    if params:
        # Create parameter signature string (e.g., "key: u256")
        param_signature = ", ".join([f"{key}: {value}" for key, value in params.items()])
        template_str = template_str.replace("{{param_signature}}", param_signature)
        
        # Replace other placeholders
        for key, value in params.items():
            template_str = template_str.replace(f"{{{key}}}", value)
    
    return template_str

def parse_param(param):
    return ", ".join([f"{key}: {value}" for key, value in params.items()])  


# def generate_contract():

# def generate_function(language_json, function_name, return_type, params):

# def generate_function(language_json, function_name, params):

# def generate_functions(language_json, function_names, input_types, output_types):

# def generate_storage():

# def generate_interface():

def main():
    # Load the language map from the JSON file
    language_map = load_json('language.json')
    
    # For generating functions
    # Example parameters passed dynamically
    params = {
        "function_name": "get",
        "param1": "u256",  # input type
        "param2": "u128"   # output type
    }
    
    # Call generate_code with 'set' function and passed parameters
    generated_code = generate_cairo_code(language_map, "FUNCTION", 'get', params)
    
    # Print the generated code
    print(generated_code)

if __name__ == "__main__":
    main()