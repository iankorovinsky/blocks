#[starknet::interface]
trait IMyContract<TContractState> {
        fn set(self: @TContractState) -> u64;
}

#[starknet::contract]
mod MyContract {
        use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

        #[storage]
        struct Storage {
                storage_var_1: u64,
        }

        #[abi(embed_v0)]
        impl MyContract of super::IMyContract<ContractState> {
                fn set(self: @ContractState) -> u64 {
                        self.storage_var_1.read()
                }
        }
}