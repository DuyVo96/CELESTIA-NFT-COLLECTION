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
 
 Contract: ```0xc5DDAdBEE65558dD174DBCd43362944EEe5746aC ```
 
 You can see two of this repo for more informations:
 
 https://github.com/DuyVo96/Whitelist-Contract
 
 https://github.com/DuyVo96?tab=repositories
 
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
HTTP_URL="add-quicknode-http-provider-url-here"

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
 The output in terminal will look like:
 
 ![image](https://user-images.githubusercontent.com/85976363/233338001-9f138244-ef4c-4ce0-a97d-42712ced6b26.png)
 
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
 
 
 
 
