#[starknet::interface]
trait IBasicContract<TContractState> {
	fn deposit(ref self: TContractState, amount: u32);
	fn withdraw(ref self: TContractState, amount: u32);
}



#[starknet::contract]
mod BasicContract {
	use core::starknet::storage::{StoragePointerWriteAccess};

	#[storage]
	struct Storage {
		balance: u32,
	}

	#[abi(embed_v0)]
	impl BasicContract of super::IBasicContract<ContractState> {
		fn deposit(ref self: ContractState, amount: u32) {
			self.balance.write(self.balance.read() + 100);
		}
		fn withdraw(ref self: ContractState, amount: u32) {
			self.balance.write(self.balance.read() - 50);
		}
	}
}