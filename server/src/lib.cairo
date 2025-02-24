#[starknet::interface]
trait Iweeeee<TContractState> {
}



#[starknet::contract]
mod weeeee {
	#[storage]
	struct Storage {
	}

	#[constructor]
	fn constructor(ref self: ContractState, hahaha: u16, Typed Variable: ByteArray) {
			
	}

	#[abi(embed_v0)]
	impl weeeee of super::Iweeeee<ContractState> {
	}
}