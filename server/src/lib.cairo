#[starknet::interface]
trait IBasicStorage<TContractState> {
}



#[starknet::contract]
mod BasicStorage {

	#[storage]
	struct Storage {
	}

	#[abi(embed_v0)]
	impl BasicStorage of super::IBasicStorage<ContractState> {
	}
}