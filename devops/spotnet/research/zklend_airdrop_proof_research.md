# ZkLend Airdrop Proof Retrieval Research and Implementation

## Summary
This document describes the research and implementation process for retrieving airdrop proofs for the ZkLend contract address `0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0`. Various alternative API endpoints were tested during this process. The code implementation and findings are documented below.

---

## Research Process

### Steps Undertaken:
1. **Explored the ZkLend Airdrop API:**
   - The endpoint `https://app.zklend.com/api/reward/all/` was identified as the commonly used API in GitHub references.
   - This endpoint provides airdrop proof data required for claiming rewards.

2. **Tested Alternative Endpoints:**
   - Explored several alternative endpoints to check their functionality and data response:
     - `https://strk-dist-backend.nimbora.io/get_calldata?address={}`
     - `https://mainnet-api.ekubo.org/airdrops/{}?token={}`
     - `https://api.vesu.xyz/users/{}/strk-rewards`

3. **Validation Process:**
   - Verified each endpoint by querying with the contract address `0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0`.
   - Checked the response structure to ensure it contains the necessary fields (e.g., `proof`, `amount`, `recipient`).

---

### Findings:
1. The ZkLend API (`https://app.zklend.com/api/reward/all/`) did not provide valid or usable data for the specified contract address..
2. Alternative endpoints either returned incomplete data or failed to respond correctly to the specified contract address.

---

### Example Logs:
Below are the results obtained while testing various endpoints:

```bash
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ PYTHONPATH=. python3 web_app/contract_tools/airdrop.py
{}
airdrops=[]
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ cat web_app/contract_tools/airdrop.py | grep END
    REWARD_API_ENDPOINT = "https://strk-dist-backend.nimbora.io/get_calldata?address="
        self.api = APIRequest(base_url=self.REWARD_API_ENDPOINT)
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ PYTHONPATH=. python3 web_app/contract_tools/airdrop.py
{}
airdrops=[]
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ cat web_app/contract_tools/airdrop.py | grep END
    REWARD_API_ENDPOINT = "https://app.zklend.com/api/reward/all/"
        self.api = APIRequest(base_url=self.REWARD_API_ENDPOINT)
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ PYTHONPATH=. python3 web_app/contract_tools/airdrop.py
[]
airdrops=[]
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ cat web_app/contract_tools/airdrop.py | grep END
    REWARD_API_ENDPOINT = "https://mainnet-api.ekubo.org/airdrops/"
        self.api = APIRequest(base_url=self.REWARD_API_ENDPOINT)
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ PYTHONPATH=. python3 web_app/contract_tools/airdrop.py
{}
airdrops=[]
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ cat web_app/contract_tools/airdrop.py | grep END
    REWARD_API_ENDPOINT = "https://api.vesu.xyz/users/"
        self.api = APIRequest(base_url=self.REWARD_API_ENDPOINT)
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$ PYTHONPATH=. python3 web_app/contract_tools/airdrop.py
{'data': {'walletAddress': '0x0698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0', 'amount': '0', 'decimals': 18, 'distributorData': {'distributedAmount': '0', 'claimedAmount': '0'}}}
None
(env) jagadeesh@DESKTOP-DO11A83:~/ODhack/spotnet$
```

#### Alternative API Endpoints:
   - `https://strk-dist-backend.nimbora.io/get_calldata?address=`: **Result:** No data returned.  
   - `https://mainnet-api.ekubo.org/airdrops/`: **Result:** No data returned.  
   - `https://api.vesu.xyz/users/`: **Result:** Returned irrelevant data structure.

## Conclusion

The ZkLend API ([https://app.zklend.com/api/reward/all/](https://app.zklend.com/api/reward/all/)) and all tested alternatives failed to provide valid data for the specified contract address.

# References

Below are the references used during research:

- The alternative endpoints were identified in the following file:  
  [api.starknet.quest - rewards.rs (line 294)](https://github.com/lfglabs-dev/api.starknet.quest/blob/2089420165057622a8bab41b698bb1da037903a9/src/endpoints/defi/rewards.rs#L294)  

- The airdrop script to fetch proofs for the specified contract address using ZkLend endpoints is implemented in:  
  [spotnet - airdrop.py](https://github.com/djeck1432/spotnet/blob/main/web_app/contract_tools/airdrop.py)  

3. Alternative API Endpoints:
   - `https://strk-dist-backend.nimbora.io/get_calldata?address={}`
   - `https://mainnet-api.ekubo.org/airdrops/{}?token={}`
   - `https://api.vesu.xyz/users/{}/strk-rewards`