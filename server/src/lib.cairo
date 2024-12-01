#[starknet::interface]
trait ISimpleStorage<TContractState> {
	fn unnamed_function(self: @TContractState) -> u64;
}

#[starknet::contract]
mod SimpleStorage {

	#[storage]
	struct Storage {
		storagename1: u64,
	}

	#[abi(embed_v0)]
	impl SimpleStorage of super::ISimpleStorage<ContractState> {
		fn unnamed_function(self: @ContractState) -> u64 {
			self.storagename1.read()
		}
	}
}