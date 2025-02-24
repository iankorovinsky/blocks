from dotenv import load_dotenv
from os import getenv
from openai import OpenAI
import json

load_dotenv()  # Add this line before creating the client
client = OpenAI(api_key=getenv("OPENAI_API_KEY"))


def get_block_structure(prompt: str):
    """Generate a block structure based on the prompt using available block types."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """You are a smart contract block builder that creates Cairo smart contracts using a visual block system.
                Create smart contract block structure jsons using only the supported block types and valid connections between them."""
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "block_structure",
                "schema": {
                    "type": "object",
                    "required": ["contractName", "nodeData", "edgeData"],
                    "properties": {
                        "contractName": {
                            "type": "string"
                        },
                        "nodeData": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "required": ["id", "data", "type", "position", "measured", "selected", "dragging"],
                                "properties": {
                                    "id": {
                                        "type": "string",
                                        "pattern": "^[a-zA-Z]+_[0-9]+$"
                                    },
                                    "data": {
                                        "type": "object",
                                        "required": ["type", "label", "identifier"],
                                        "properties": {
                                            "type": {
                                                "type": "string",
                                                "enum": ["STORAGE_VAR", "PRIM_TYPE", "FUNCTION", "TYPED_VAR", "CODE", "EVENT", "STRUCT"]
                                            },
                                            "label": {"type": "string"},
                                            "identifier": {"type": "string"},
                                            "storage_variable": {"type": "string"},
                                            "name": {"type": "string"},
                                            "code": {"type": "string"},
                                            "amount": {"type": "string"}
                                        },
                                        "additionalProperties": False
                                    },
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "storage",
                                            "primitive",
                                            "constructor",
                                            "typedVariable",
                                            "code",
                                            "eventNode",
                                            "struct",
                                            "getFunction",
                                            "setFunction",
                                            "incrementFunction",
                                            "decrementFunction"
                                        ]
                                    },
                                    "position": {
                                        "type": "object",
                                        "required": ["x", "y"],
                                        "properties": {
                                            "x": {"type": "number"},
                                            "y": {"type": "number"}
                                        },
                                        "additionalProperties": False
                                    },
                                    "measured": {
                                        "type": "object",
                                        "required": ["width", "height"],
                                        "properties": {
                                            "width": {"type": "number"},
                                            "height": {"type": "number"}
                                        },
                                        "additionalProperties": False
                                    },
                                    "selected": {"type": "boolean"},
                                    "dragging": {"type": "boolean"}
                                },
                                "additionalProperties": False
                            }
                        },
                        "edgeData": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "required": ["id", "type", "source", "target", "sourceHandle"],
                                "properties": {
                                    "id": {
                                        "type": "string",
                                        "pattern": "^xy-edge__[a-zA-Z0-9_-]+$"
                                    },
                                    "type": {
                                        "type": "string",
                                        "enum": ["custom"]
                                    },
                                    "source": {"type": "string"},
                                    "target": {"type": "string"},
                                    "sourceHandle": {"type": "string"},
                                    "targetHandle": {"type": "string"}
                                },
                                "additionalProperties": False
                            }
                        }
                    },
                    "additionalProperties": False
                }
            }
        },
        temperature=0.7,
        max_tokens=4096,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    try:
        result = response.choices[0].message.content
        json_result = json.loads(result)
        
        # Write the result to sample10.json with proper formatting
        with open('sample10.json', 'w') as f:
            json.dump(json_result, f, indent=2)
            
        return json_result
    except Exception as e:
        print(f"Error parsing response: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Generate the structure and save it to sample10.json
    get_block_structure("I want a person smart contract with some getter and setter functions")