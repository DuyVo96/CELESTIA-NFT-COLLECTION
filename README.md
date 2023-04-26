# Full stack modular NFT COLLECTION with CELESTIA

## I. Install and start our Ethermint Rollup
  Use this link:  https://rollkit.dev/docs/tutorials/ethermint/
  
  If it runs successfully, the screen will show the same below:
  
  ![image](https://user-images.githubusercontent.com/85976363/233321518-9ab1d4a3-033c-4f78-861a-16e1b9fa44d8.png)
  
  Get your ```PRIVATE_KEY``` to deploy your smartcontract by using the following script:
  
  ```
  ethermintd keys unsafe-export-eth-key mykey --keyring-backend test
  ```
  
  The output will look like:
  
  ![image](https://user-images.githubusercontent.com/85976363/233338547-4d89d42a-d8d3-4d10-9849-0be01f131c72.png)

## II. SmartContract and UI of Celestia NFT dapp
### 1. SmartContract
I use Hardhat to write smart contract, deploy, run tests, and debug your code.

Follow the script below to:
  ```
  mkdir Celestia-NFT-Collection
  cd Celestia-NFT-Collection
  mkdir hardhat-tutorial
  cd hardhat-tutorial
  npm init --yes
  npm install --save-dev hardhat
  ```
Install some dependencies:
  ```
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
  ```
 I wrote a Whitelist smartcontract and deployed it for first 30 users to sign and get whitelisted.
 
My Contract: ```0x3937629E2Ff82eE9F44835077885f9013f5dE4C5 ```
 
 You can see two of this repo for more informations:
 
 https://github.com/DuyVo96/Whitelist-Contract
 
https://github.com/DuyVo96/Whitelist-UI
 
 The link of UI: https://whitelist-ui-six.vercel.app/
 
 Cause I deployed this contract so now just create interface for this ```IWhitelist.sol```, detail in repo below:
 
 https://github.com/DuyVo96/Celestia-nft-collection-contract/blob/master/contracts/IWhitelist.sol
 
 Create CelestiaNft.sol contract mint the NFT:
  - Total supply is 30 NFT.
  - Only deployer can start the period of mint.
  - Mint price is: 0.01 CTE.
  - Whitelist can only mint in 5 minutes after deployer start.
  - The whitelist address from IWhitelist.sol will mint first, if the whitelist mint < 30, the NFT left will move to public mint after 5 minutes.
 
 Detail of contract:
 https://github.com/DuyVo96/Celestia-nft-collection-contract/blob/master/contracts/CelestiaNft.sol
 
 Create a .env to put your ```PRIVATE_KEY``` and ```HTTP_URL```,```PRIVATE_KEY``` is the key of address you export above when start Ethermint, ```HTTP_URL``` is such as ```[HTTP_URL](http://149.102.158.186:8545)```, ```149.102.158.186``` is my light node ip and ```8545``` is the port, make sure to replace with your own.
 
 Install dotenv:
 
   ```
npm install dotenv
  ```
 Your .env file will look like:
 
  
  ```
HTTP_URL="rpc"

PRIVATE_KEY="add-the-private-key-here"
  ```
  
 Create a ```constants``` folder with ```index.js``` in it like this one:
 
 https://github.com/DuyVo96/Celestia-nft-collection-contract/blob/master/constants/index.js
 
 Write ```deploy.js```:
 
 https://github.com/DuyVo96/Celestia-nft-collection-contract/blob/master/scripts/deploy.js
 
 Set up ```Ethermint network``` in ```hardhat.config.js```:
 
 https://github.com/DuyVo96/Celestia-nft-collection-contract/blob/master/hardhat.config.js
 
 In the terminal run this following script to compile a deploy:
 
  ```
npx hardhat compile

npx hardhat run scripts/deploy.js --network ethermint
  ```
 
  My Contract: ```0xe56d721aBb6D7B0614eA4C7f4d8dFC0cad26e757 ```
   
 The output in terminal will look like:
 
![image](https://user-images.githubusercontent.com/85976363/234471406-9b392d10-5731-492d-b293-91715282be57.png)

 
 Save this address to use on UI part.

 ### 2. UI
 In terminal now back to ```Celestia-NFT-Collection``` root and create a Nextjs app:
 
  ```
npx create-next-app@latest
  ```
  
  Go to this app and run:
  
  ```
npm install web3modal
npm install ethers@5
  ```
  
  Replace your ```index.js``` with the file below:
  
  https://github.com/DuyVo96/CELESTIA-NFT-COLLECTION/blob/main/pages/index.js
  
  
   Create a ```constants``` folder with ```index.js``` in it like this one:
  
  https://github.com/DuyVo96/CELESTIA-NFT-COLLECTION/blob/main/constants/index.js
  
  ```abi``` and ```NFT_CONTRACT_ADDRESS```  from contract that we deployed above.
  
 
 Do the same with ```Home.module.css```:
 
 https://github.com/DuyVo96/CELESTIA-NFT-COLLECTION/blob/main/styles/Home.module.css
 
 Start your app:

  ```
npm run dev
  ```
 ## III. Let's test my the dapp
 1. Set up your metamask with Ethermint network:
 
 - Network Name: Ethermint
 - New RPC URL: http://localhost:8545 or https://your.custom.ip.address:port
 - Chain ID: 9000
 - Currency symbol: CTE
 
 ![image](https://user-images.githubusercontent.com/85976363/233341527-f6ebeb39-a582-486d-8c1b-ff8fccfc216f.png)

 
 2. Go this link to register to be whitelisted
 
 https://whitelist-ui-six.vercel.app/
 
 Connect your wallet and click ```JOIN THE WHITELIST``` button
 
 ![image](https://user-images.githubusercontent.com/85976363/233341655-dca78402-fc30-4334-9d5d-62ac77c5aef6.png)

 Confirm tx and waiting:
 
 ![image](https://user-images.githubusercontent.com/85976363/233341798-13ea3304-5ff5-4177-80ca-f616e6d86216.png)
 
 After tx confirmed the screen will look like:
 
 ![image](https://user-images.githubusercontent.com/85976363/233341942-18054ee6-2ee3-45b9-b767-621883c74930.png)

You can try with another accounts cause total whitelist is 30 slots.

I tried with another 2 wallets and the number increased to 3 joined the Whitelist.

![image](https://user-images.githubusercontent.com/85976363/233342630-d6ec6e02-25ff-4019-85b7-abc83dcb9d27.png)

 3. Go this link to mint NFT
 
 Connect with the wallet that you used to deployed contract in last part to ```START PRESALE```
 
 ![image](https://user-images.githubusercontent.com/85976363/233349469-3fc78aa7-fbc0-4594-87f3-42dd3afb67dd.png)

Confirm tx and waiting:

![image](https://user-images.githubusercontent.com/85976363/233349585-5fe141b2-55cc-4c08-8486-56f47044cbbe.png)

Now the whitelist addresses can mint NFT:

![image](https://user-images.githubusercontent.com/85976363/233349696-9e6d7ac5-f8ba-4700-a460-3f6620299c10.png)

I start to mint:
![image](https://user-images.githubusercontent.com/85976363/233349766-414e7a81-56f9-4ff6-87f5-38cd1a4ca5ae.png)
![image](https://user-images.githubusercontent.com/85976363/233349925-bb966a8e-bbd0-49dc-8fac-f1c9471c2493.png)


Now you can add Contract address and tokenId to metamask to see your NFT infor:

![image](https://user-images.githubusercontent.com/85976363/233350632-cc68cd60-0852-4b0c-91c3-bd8b253d4399.png)

![image](https://user-images.githubusercontent.com/85976363/233350673-1f4e7cee-fa21-4eb7-8069-37c58043cdd0.png)

After 5 minutes public will start and everyone can mint untill 30 slots are over 🔥🔥🔥🔥🔥🔥🔥🔥🔥

## 🔥 At the time project team review my bonus task, the presale mint was over and team can only mint public 🔥

## 🔥 Because sometime node run not stable so I must restart node and ethermint so the final NFT contract can be change cause I must deploy again 🔥

## 🔥 Final contract: 0xe56d721aBb6D7B0614eA4C7f4d8dFC0cad26e757 🔥


# FINISH
