#[starknet::interface]
trait IMyContract<TContractState> {
	fn emit_ball(ref self: TContractState, meow: bytes31, wolf: bool);
}



#[starknet::contract]
mod MyContract {

	#[storage]
	struct Storage {
	}

	#[derive(Drop, starknet::Event)]
	pub struct ball {
		meow: bytes31,
		wolf: bool,
	}

	#[event]
	#[derive(Drop, starknet::Event)]
	pub enum Event {
		ball: ball,
	}

	#[abi(embed_v0)]
	impl MyContract of super::IMyContract<ContractState> {
		fn emit_ball(ref self: ContractState, meow: bytes31, wolf: bool)
		{
			self.emit(Event::ball(ball { meow, wolf }));
		}
	}
}