from typing import List, Dict


def extract_constructor_args(constructor_args: List[Dict[str, str]]) -> str:
    string_args = ""
    for arg in constructor_args:
        if arg.get("type") == "ByteArray":
            string_args += f' bytearray:str:{arg.get("value")}'
        elif arg.get("type") == "u256":
            string_args += f' u256:{arg.get("value")}'
        else:
            string_args += f' {arg.get("value")}'
    return string_args.strip()