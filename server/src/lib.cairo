#[starknet::interface]
trait ISimpleStorage<TContractState> {
	fn get(self: @TContractState) -> u64;
}

#[starknet::contract]
mod SimpleStorage {
	use core::starknet::storage::{StoragePointerReadAccess};

	#[storage]
	struct Storage {
		storagename1: u64,
	}

	#[abi(embed_v0)]
	impl SimpleStorage of super::ISimpleStorage<ContractState> {
		fn get(self: @ContractState) -> u64 {
			self.storagename1.read()
		}
	}
}