#[starknet::contract]
pub mod ERC20Mock {
    use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use starknet::ContractAddress;
    use margin::interface::IERC20MetadataForPragma;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    #[abi(embed_v0)]
    impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;
    impl InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        pub erc20: ERC20Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: ByteArray,
        symbol: ByteArray,
        initial_supply: u256,
        recipient: ContractAddress,
    ) {
        self.erc20.initializer(name, symbol);
        self.erc20.mint(recipient, initial_supply);
    }

    impl IERC20MetadataForPragmaImpl of IERC20MetadataForPragma<ContractState> {
        fn name(self: @ContractState) -> ByteArray {
            self.erc20.ERC20_name.read()
        }

        // Assume symbol is at most 31 bytes
        fn symbol(self: @ContractState) -> felt252 {
            let mut output = array![];
            self.erc20.ERC20_symbol.read().serialize(ref output);

            *output.at(0)
        }

        fn decimals(self: @ContractState) -> felt252 {
            18
        }
    }
}
