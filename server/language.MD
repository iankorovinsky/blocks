#JSON to Cairo Language Specification


#[starknet::interface]

trait I`{NAME}`<TContractState> {
    
    // All of the functions are placed here with their signatures
    // Each signature is of the form:

    fn `{FUNCTION_NAME}`(`{FUNCTION_PARAMETERS}`) -> `{RETURN_TYPE}`;

    or 

    fn `{FUNCTION_NAME}`(`{FUNCTION_PARAMETERS}`)

    or

    fn `{FUNCTION_NAME}`() -> `{RETURN_TYPE}`

    fn set(ref self: TContractState, x: u128);
    fn get(self: @TContractState) -> u128;
}

#[starknet::contract]
mod `{NAME}` {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {

        // Store a list of all of your global variables
        `{PARAM_NAME}`: `{PARAM_TYPE}`

    }

    #[abi(embed_v0)]
    impl {`NAME`} of super::I{`NAME`}<ContractState> {
        
        // A list of functions in the format of:

        fn `{FUNCTION_NAME}`(`{FUNCTION_PARAMETERS}`) -> `{RETURN_TYPE}` {
            `{CODE}`
        }

        fn `{FUNCTION_NAME}`() -> `{RETURN_TYPE}` {
            `{CODE}`
        }

        fn `{FUNCTION_NAME}`(`{FUNCTION_PARAMETERS}`) {
            `{CODE}`
        }

    }
}


// TYPES




// FUNCTIONS


fn set(ref self: ContractState, x: u128) {
    self.stored_data.write(x);
}



fn get(self: @ContractState) -> u128 {
    self.stored_data.read()
}
