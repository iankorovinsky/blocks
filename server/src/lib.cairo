#[starknet::interface]
trait IMyContract<TContractState> {
	fn fcnname(ref self: TContractState, value: u256);
}



#[starknet::contract]
mod MyContract {
	use core::starknet::storage::{StoragePointerWriteAccess};

	#[storage]
	struct Storage {
		sheep: u256,
	}

	#[abi(embed_v0)]
	impl MyContract of super::IMyContract<ContractState> {
		fn fcnname(ref self: ContractState, value: u256) {
			self.sheep.write(value);
		}
	}
}