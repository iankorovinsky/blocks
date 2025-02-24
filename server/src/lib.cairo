#[starknet::interface]
trait ItestConstructor<TContractState> {
	fn deposit(ref self: TContractState, amount: u16);
	fn withdraw(ref self: TContractState, amount: u16);
}



#[starknet::contract]
mod testConstructor {
	use core::starknet::storage::{StoragePointerWriteAccess};

	#[storage]
	struct Storage {
		balance: u16,
	}

	#[abi(embed_v0)]
	impl testConstructor of super::ItestConstructor<ContractState> {
		fn deposit(ref self: ContractState, amount: u16) {
			self.balance.write(self.balance.read() + 100);
		}
		fn withdraw(ref self: ContractState, amount: u16) {
			self.balance.write(self.balance.read() - 50);
		}
	}
}