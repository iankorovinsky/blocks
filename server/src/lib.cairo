#[starknet::interface]
trait IMyContract<TContractState> {
	fn get(self: @TContractState) -> u64;
}

#[starknet::contract]
mod MyContract {
	use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

	#[storage]
	struct Storage {
		storagename1: u64,
	}

	#[abi(embed_v0)]
	impl MyContract of super::IMyContract<ContractState> {
		fn get(self: @ContractState) -> u64 {
			self.storagename1.read()
		}
	}
}