#[starknet::interface]
trait Iskiing<TContractState> {
	fn getSheep(self: @TContractState) -> bool;
	fn emit_denver(ref self: TContractState, slopes: felt252, mountain: bool);
}



#[starknet::contract]
mod skiing {
	use core::starknet::storage::{StoragePointerReadAccess};

	#[storage]
	struct Storage {
		sheep: bool,
	}

	#[derive(Drop, starknet::Event)]
	pub struct Denver {
		slopes: felt252,
		mountain: bool,
	}

	#[event]
	#[derive(Drop, starknet::Event)]
	pub enum Event {
		Denver: Denver,
	}

	#[abi(embed_v0)]
	impl skiing of super::Iskiing<ContractState> {
		fn getSheep(self: @ContractState) -> bool {
			self.sheep.read()
		}
		fn emit_denver(ref self: ContractState, slopes: felt252, mountain: bool)
		{
			self.emit(Event::Denver(Denver { slopes, mountain }));
		}
	}
}