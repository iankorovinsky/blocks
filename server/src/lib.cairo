#[starknet::interface]
trait ISample<TContractState> {
}



#[starknet::contract]
mod Sample {

	#[storage]
	struct Storage {
	}

	#[abi(embed_v0)]
	impl Sample of super::ISample<ContractState> {
	}
}