# RogueNFT

## About

**RogueNFT** is a full-stack system simulating an environment where users can participate in a Roguelike fantasy story generation. The Ethereum smart contract is developed using **HardHat**, while the backend and frontend are developed using **Node.js** and **Next.js**, respectively.

Users can mint RogueHeroes NFTs, send them on adventures, and merge them to create more powerful heroes. Each adventure generates a randomized fantasy story based on the NFT's metadata and level. The system mimics the progression of a Roguelike game, where NFTs gain experience points (XP) and grow in power over time.

## Features

- **Mint RogueHeroes NFTs**: Each token has a randomized hero class and a level (between 1-10).
- **Adventures**: Send your NFTs on adventures, generating unique, randomly-created stories and earning XP based on the complexity of the adventure.
- **Merge NFTs**: Combine two NFTs of the same hero class to create a new NFT with a combined level. The new NFT starts at level 1 and has 0 XP and no past adventures.
- **Adventure History**: Keep track of an NFT's adventure history, creating a long and rich narrative as the hero progresses through different quests.

## System Setup

### Prerequisites

- **Node.js**: Ensure that you have Node.js installed.
- **HardHat**: A development environment for Ethereum.
- **MetaMask**: For interacting with the Ethereum network.
- **Git**: For cloning repositories.

### Running the System

#### Smart Contract Setup

1. Install dependencies:

   ```bash
   npm install
