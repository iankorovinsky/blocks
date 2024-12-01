from dotenv import load_dotenv
from os import getenv
from openai import OpenAI

load_dotenv()  # Add this line before creating the client
client = OpenAI(api_key=getenv("OPENAI_API_KEY"))


def get_block_structure(prompt: str) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o",
            messages=[
            {
                "role": "system",
                "content": [
                    {
                    "text": "you are a smart contract block builder. output structured json based on what you know:\n\n{\n  \"name\": \"graph_schema\",\n  \"schema\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"initialNodes\": {\n        \"type\": \"array\",\n        \"description\": \"A list of nodes in the graph.\",\n        \"items\": {\n          \"type\": \"object\",\n          \"properties\": {\n            \"id\": {\n              \"type\": \"string\",\n              \"description\": \"Unique identifier for the node.\"\n            },\n            \"position\": {\n              \"type\": \"object\",\n              \"properties\": {\n                \"x\": {\n                  \"type\": \"number\",\n                  \"description\": \"X-coordinate of the node position.\"\n                },\n                \"y\": {\n                  \"type\": \"number\",\n                  \"description\": \"Y-coordinate of the node position.\"\n                }\n              },\n              \"required\": [\n                \"x\",\n                \"y\"\n              ],\n              \"additionalProperties\": false\n            },\n            \"data\": {\n              \"type\": \"object\",\n              \"properties\": {\n                \"label\": {\n                  \"type\": \"string\",\n                  \"description\": \"Label displayed for the node.\"\n                },\n                \"type\": {\n                  \"type\": \"string\",\n                  \"description\": \"Type of the node.\"\n                },\n                \"identifier\": {\n                  \"type\": \"string\",\n                  \"description\": \"Identifier for the node.\"\n                },\n                \"storage_variable\": {\n                  \"type\": \"string\",\n                  \"description\": \"Storage variable associated with the node, if applicable.\"\n                },\n                \"name\": {\n                  \"type\": \"string\",\n                  \"description\": \"Name associated with the function.\"\n                }\n              },\n              \"required\": [\n                \"label\",\n                \"type\",\n                \"identifier\",\n                \"storage_variable\",\n                \"name\"\n              ],\n              \"additionalProperties\": false\n            },\n            \"type\": {\n              \"type\": \"string\",\n              \"description\": \"Specific type of the node.\"\n            }\n          },\n          \"required\": [\n            \"id\",\n            \"position\",\n            \"data\",\n            \"type\"\n          ],\n          \"additionalProperties\": false\n        }\n      },\n      \"initialEdges\": {\n        \"type\": \"array\",\n        \"description\": \"A list of edges connecting the nodes.\",\n        \"items\": {\n          \"type\": \"object\",\n          \"properties\": {\n            \"id\": {\n              \"type\": \"string\",\n              \"description\": \"Unique identifier for the edge.\"\n            },\n            \"source\": {\n              \"type\": \"string\",\n              \"description\": \"Source node identifier.\"\n            },\n            \"target\": {\n              \"type\": \"string\",\n              \"description\": \"Target node identifier.\"\n            }\n          },\n          \"required\": [\n            \"id\",\n            \"source\",\n            \"target\"\n          ],\n          \"additionalProperties\": false\n        }\n      }\n    },\n    \"required\": [\n      \"initialNodes\",\n      \"initialEdges\"\n    ],\n    \"additionalProperties\": false\n  },\n  \"strict\": true\n}",
                    "type": "text"
                    }
                ]
                }
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                "name": "graph_schema",
                "schema": {
                    "type": "object",
                    "required": [
                    "initialNodes",
                    "initialEdges"
                    ],
                    "properties": {
                    "initialEdges": {
                        "type": "array",
                        "items": {
                        "type": "object",
                        "required": [
                            "id",
                            "source",
                            "target"
                        ],
                        "properties": {
                            "id": {
                            "type": "string",
                            "description": "Unique identifier for the edge."
                            },
                            "source": {
                            "type": "string",
                            "description": "Source node identifier."
                            },
                            "target": {
                            "type": "string",
                            "description": "Target node identifier."
                            }
                        },
                        "additionalProperties": False
                        },
                        "description": "A list of edges connecting the nodes."
                    },
                    "initialNodes": {
                        "type": "array",
                        "items": {
                        "type": "object",
                        "required": [
                            "id",
                            "position",
                            "data",
                            "type"
                        ],
                        "properties": {
                            "id": {
                            "type": "string",
                            "description": "Unique identifier for the node."
                            },
                            "data": {
                            "type": "object",
                            "required": [
                                "label",
                                "type",
                                "identifier",
                                "storage_variable",
                                "name"
                            ],
                            "properties": {
                                "name": {
                                "type": "string",
                                "description": "Name associated with the function."
                                },
                                "type": {
                                "type": "string",
                                "description": "Type of the node."
                                },
                                "label": {
                                "type": "string",
                                "description": "Label displayed for the node."
                                },
                                "identifier": {
                                "type": "string",
                                "description": "Identifier for the node."
                                },
                                "storage_variable": {
                                "type": "string",
                                "description": "Storage variable associated with the node, if applicable."
                                }
                            },
                            "additionalProperties": False
                            },
                            "type": {
                            "type": "string",
                            "description": "Specific type of the node."
                            },
                            "position": {
                            "type": "object",
                            "required": [
                                "x",
                                "y"
                            ],
                            "properties": {
                                "x": {
                                "type": "number",
                                "description": "X-coordinate of the node position."
                                },
                                "y": {
                                "type": "number",
                                "description": "Y-coordinate of the node position."
                                }
                            },
                            "additionalProperties": False
                            }
                        },
                        "additionalProperties": False
                        },
                        "description": "A list of nodes in the graph."
                    }
                    },
                    "additionalProperties": False
                },
                "strict": True
                }
            },
            temperature=1,
            max_tokens=4096,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
            )
    return response.choices[0].message.content

print(get_block_structure("i want a person smart contract with some getter and setter functions"))