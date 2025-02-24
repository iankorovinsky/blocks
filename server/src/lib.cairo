#[starknet::interface]
pub trait INameRegistry<TContractState> {
    fn set_name(ref self: TContractState, name: u128);
    fn get_name(self: @TContractState) -> u128;
}

#[starknet::contract]
mod NameRegistry {
    use core::starknet::storage::{
        StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };

    #[storage]
    struct Storage {
        name: u128
    }

    #[constructor]
    fn constructor(ref self: ContractState, name: u128) {
        self.name.write(name);
    }

    #[abi(embed_v0)]
    impl NameRegistry of super::INameRegistry<ContractState> {
        fn set_name(ref self: ContractState, name: u128) {
            self.name.write(name);
        }

        fn get_name(self: @ContractState) -> u128 {
            return self.name.read();
        }
    }
}