# RogueNFT

## About

**RogueNFT** is a full-stack system simulating a local environment where users can participate in a Roguelike fantasy story generation powered by Ethereum smart contract technology. The smart contract is developed using **HardHat**, while the backend and frontend are developed using **Node.js** and **Next.js**, respectively.

In RogueNFT, users can mint RogueHeroes NFTs, send them on adventures, and merge them to create more powerful heroes. Each adventure generates a randomized fantasy story based on the NFT's metadata. Furthermore, the system mimics the progression of a Roguelike game, where NFTs gain experience points (XP) and grow in power over time by going through adventures.

The goal of this RogueNFT, is to continuously set your heros to adventures. The better and more complete the story generated, the more valuable it is. The rights of generated stories are owned by the NFT owner.

## Features
- **Mint RogueHeroes NFTs**: Each token minted has a randomized hero class and a level (between 1-10).
- **Adventures**: Send your NFTs on adventures, generating unique, randomly-created stories influenced by the NFT's metadata and earn XP based on the complexity of the adventure.
- **Merge NFTs**: Combine two NFTs of the same hero class to create a new NFT with a combined level. The new NFT starts at a level that is the addition of the two previously merged NFT, but has 0 XP and no past adventures.
- **Adventure History**: An NFT's adventure history is kept tracked and stored on the blockchain, creating a long and rich narrative as the hero progresses through different quests. Furthermore, allowing users to potentially craete NFTs with continuing storylines as vast as a novel

## Notes
- The higher the level of an NFT, the more detailed the generated stories will be.
- Merging NFTs is a high-risk, high-reward action. Merged NFTs lose all XP and adventures, but you get to skip to higher levels faster.
- After every adventure, the NFT will have a cooldown period of 5 minutes

## Future Improvements
1. To include a generated image of the RogueHero during minting. The art should be in a 2D Pixel TileMap artstyle.
2. To include better session management during user login
3. To include the features of items, that users has a small chance of finding during adventures. Making it tradable between wallets.
4. Items to give special advantage to RogueHeroes that uses it. Their artstyle will be re-generated to include the item.

## System Setup
### Prerequisites

- **Node.js**: Ensure that you have Node.js of at least version 20 installed.
- **Git**: For cloning repositories.

### Running the System

#### Smart Contract Setup

1. Install dependencies:
   ```bash
   npm install
2. Initialize HardHat project:
   ```bash 
   npx hardhat init
3. Compile the smart contract:
   ```bash
   npx hardhat compile
4. Start a local Ethereum network:
   ```bash
   npx hardhat node
5. Deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost

#### Backend Setup
1. After running the smart contract, go to the /artifacts/contracts directory.
2. Find RogueContract.sol and navigate to RogueNFT.json. Copy the array value of the key "abi".
3. In the backend directory, create or find the file abi.js and paste the copied ABI array into it.
4. Install backend dependencies:
   ```bash
   npm install
5. Run the backend locally:
   ```bash
   npm run local

To test the contract before running, simple run:
      ```bash
      npx hardhat test


#### Frontend Setup
1. In the frontend directory, install dependencies:
   ```bash
   npm install
2. Start the frontend development server:
   ```bash
   npm run dev


### System Example

![Alt text](./readMeImages/image1.png?raw=true "Start")
![Alt text](./readMeImages/merge.png?raw=true "Merging")

