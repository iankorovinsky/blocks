#[starknet::interface]
trait ISimpleWallet<TContractState> {
	fn get(self: @TContractState) -> u64;
}

#[starknet::contract]
mod SimpleWallet {
	use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

	#[storage]
	struct Wallet {
		value: u64,
	}

	#[abi(embed_v0)]
	impl SimpleWallet of super::ISimpleWalletContractState> {
		fn get(self: @ContractState) -> u64 {
			self.storagename1.read()
		}

        fn increment_value(ref self: ContractState, value: u64) {
            self.value.write(self.value.read() + value);
        }

        fn decrement_value(ref self: ContractState, value: u64) {
            self.value.write(self.value.read() - value);
        }
	}
}