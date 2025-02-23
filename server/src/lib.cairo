#[starknet::interface]
trait Isimple<TContractState> {
	fn emit_denver(ref self: TContractState, mountain: felt252, slopes: bool);
}



#[starknet::contract]
mod simple {

	#[storage]
	struct Storage {
	}

	#[derive(Drop, starknet::Event)]
	pub struct Denver {
		mountain: felt252,
		slopes: bool,
	}

	#[event]
	#[derive(Drop, starknet::Event)]
	pub enum Event {
		Denver: Denver,
	}

	#[abi(embed_v0)]
	impl simple of super::Isimple<ContractState> {
		fn emit_denver(ref self: ContractState, mountain: felt252, slopes: bool)
		{
			self.emit(Event::Denver(Denver { mountain, slopes }));
		}
	}
}