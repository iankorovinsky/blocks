#[starknet::interface]
trait Itest_name<TContractState> {
}



#[starknet::contract]
mod test_name {
	#[storage]
	struct Storage {
	}

	#[constructor]
	fn constructor(ref self: ContractState, pumpkin: u256, squash: u32, melon: u8) {
			
	}

	#[abi(embed_v0)]
	impl test_name of super::Itest_name<ContractState> {
	}
}