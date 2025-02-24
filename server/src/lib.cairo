#[starknet::interface]
trait Ihhu<TContractState> {
}



#[starknet::contract]
mod hhu {
	#[storage]
	struct Storage {
	}

	#[constructor]
	fn constructor(ref self: ContractState) {
			
	}

	#[abi(embed_v0)]
	impl hhu of super::Ihhu<ContractState> {
	}
}