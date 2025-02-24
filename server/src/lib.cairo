#[starknet::interface]
trait IMyContract<TContractState> {
	fn test(self: @TContractState, sheep: bool);
}

#[starknet::contract]
mod MyContract {

	#[storage]
	struct Storage {
	}

	#[abi(embed_v0)]

	impl MyContract of super::IMyContract<ContractState> {
		fn test(self: @ContractState, sheep: bool){
		    
		}
}