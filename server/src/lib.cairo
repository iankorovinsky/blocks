#[starknet::interface]
trait Imeepmeep<TContractState> {
}



#[starknet::contract]
mod meepmeep {

	#[storage]
	struct Storage {
		amount: ,
	}

	#[constructor]
	fn constructor(ref self: ContractState) {
		self.amount.write(amount);	
	}

	#[abi(embed_v0)]
	impl meepmeep of super::Imeepmeep<ContractState> {
	}
}