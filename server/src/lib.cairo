#[starknet::interface]
trait ISimpleContract<TContractState> {
	fn get(self: @TContractState) -> u64;
	fn increment_value(ref self: TContractState, amount: u64);
	fn decrement_value(ref self: TContractState, amount: u64);
}

#[starknet::contract]
mod SimpleContract {
	use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

	#[storage]
	struct Storage {
		value: u64,
	}

	#[abi(embed_v0)]
	impl SimpleContract of super::ISimpleContract<ContractState> {
		fn get(self: @ContractState) -> u64 {
			self.value.read()
		}
		fn increment_value(ref self: ContractState, amount: u64) {
			self.value.write(self.value.read() + 1);
		}
		fn decrement_value(ref self: ContractState, amount: u64) {
			self.value.write(self.value.read() - 1);
		}
	}
}