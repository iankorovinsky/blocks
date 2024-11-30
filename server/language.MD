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

integers:

u8
u16
u32
u64
u128
u256
usize

booleans:

bool

strings:

felt252
bytes31
ByteArray

arrays:

Array<T>


enums:

#[derive(Copy, Drop)]
enum Data {
    Integer: u128,
    Felt: felt252,
    Tuple: (u32, u32),
}

tuples: (type_1, type_2, type_3, ...., type_n)


dictionaries:

use core::dict::Felt252Dict;
let mut balances: Felt252Dict<u64> = Default::default();



Felt252DictEntry<T>



// FUNCTIONS


fn set(ref self: ContractState, x: u128) {
    self.stored_data.write(x);
}



fn get(self: @ContractState) -> u128 {
    self.stored_data.read()
}

// FUNCTION ATTRIBUTES

#[constructor] 
// Public

#[abi(embed_v0)] -> all functions of the contract for the interface
#[external(v0)] -> callable by anyone from outside the contract

// Private
#[generate_trait] -> private implementation of interface
#[abi(per_item)] -> define entrypoints without an explicit interface


