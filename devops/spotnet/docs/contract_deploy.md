# Devnet setup and contract deployment

### Required asdf plugins: 
* scarb
* starknet-devnet
* starknet-foundry

### Start devnet
`starknet-devnet --fork-network "http://178.32.172.148:6060/v0_7"`

### Create and deploy sncast account
`sncast account create --url http://127.0.0.1:5050 --name acc`

```
curl http://127.0.0.1:5050/mint -X POST -d '{"address": "<address after create>", "amount": 500000000000000000, "unit": "FRI"}' -H "Content-Type: application/json"
```

`sncast account deploy --url http://127.0.0.1:5050 --name acc --fee-token strk`

### Declare and deploy spotnet Core
In spotnet directory(it should compile it and then declare):
`sncast --account acc declare --url http://127.0.0.1:5050 --fee-token strk --contract-name Core`
After, deploy with generated class hash:

```
sncast --account acc deploy --url http://127.0.0.1:5050 --fee-token strk --class-hash <class-hash> --constructor-calldata 0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b 0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05
```

Now access it by address.
#### Docs:
* https://foundry-rs.github.io/starknet-foundry/starknet/account.html
* https://foundry-rs.github.io/starknet-foundry/starknet/declare.html
* https://foundry-rs.github.io/starknet-foundry/starknet/deploy.html
