#[starknet::interface]
trait ISimpleStorage<TContractState> {
    fn set(ref self: TContractState, x: u128);
    fn get(self: @TContractState) -> u128;
    fn agent(ref self: TContractState, input: ByteArray); // Added agent function
}

#[starknet::contract]
mod SimpleStorage {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        stored_data: u128
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AgentPrompt: AgentPrompt,
    }

    #[derive(Drop, starknet::Event)]
    struct AgentPrompt {
        #[key]
        user: ContractAddress,
        prompt: ByteArray,
    }

    #[abi (embed_v0)]
    impl SimpleStorage of super::ISimpleStorage<ContractState> {

        fn set(ref self: ContractState, x: u128) {
            self.stored_data.write(x);
        }

        fn get(self: @ContractState) -> u128 {
            self.stored_data.read()
        }

        fn agent(ref self: ContractState, input: ByteArray) {
            let caller = get_caller_address();
            self.emit(Event::AgentPrompt(AgentPrompt {
                user: caller,
                prompt: input,
            }));
        }
    }
}