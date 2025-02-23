#[starknet::interface]
trait Isimple<TContractState> {
}



#[starknet::contract]
mod simple {

	#[storage]
	struct Storage {
		help: bool,
	}

	#[abi(embed_v0)]
	impl simple of super::Isimple<ContractState> {
	}
}