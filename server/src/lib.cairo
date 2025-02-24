#[starknet::interface]
trait Isimple<TContractState> {
}

#[starknet::contract]
mod simple {

	#[storage]
	struct Storage {
	}

	#[constructor]
	fn constructor(ref self: ContractState, sheep: u256, cow: bool) {
		test	
	}

	#[abi(embed_v0)]
	impl simple of super::Isimple<ContractState> {
	}
}