# RogueNFT

## About
RogueNFT is a full-stack local system that simulates an environment where users can participate in a RogueLike fantasy story generation Ethereum Contract developed via HardHat. Backend and Frontend is developed via NodeJS and NextJS respectfully.

## How to Use
As of now, every users can mint as many RogueHeroes NFTs as they desire. Each minted RogueHeroes NFTs has a randomized choice of a hero and a level between 1 - 10. Upon receiving a minted token, users can set their tokens out to "adventure". Where during the process, the NFT's metadata will be used to randomly generate a story linked specially to the NFT and its current level. Each adventure will return a reasonable XP gained based on how complex the adventure was. 

It should be noted, the higher the level of an NFT, the more words are allowed to describe the RogueHero's adventure. NFTs will also have a history of their past adventures, so it is possible for a single NFT to have a long adventure, progressively adventuring through a randomly generated fantasy world much like going through a novel.

NFTs can also be merged together. However, they must be of the same Hero Class. When merged, users can create a new NFT, with a level combined by the two previously merged NFTs. Quickly skipping the process of slowly gaining XP to level up, however, users will burn their NFT tokens merged, and the newly minted NFT will have 0 XP, and 0 adventures. So its a risk to start anew!

## Instructions on Running the System In Order
### smartContract
1) npm install
2) npx hardhat init
3) npx hardhat compile
4) npx hardhat node
5) npx hardhat run scripts/deploy.js --network localhost

### backEnd
After running the steps of smartContract, please head to the /artifacts/contracts to find RogueContact.sol. In there, head to RogueNFT.json, and copy the array value of key "abi". Then, within backEnd, paste the copied array into abi.js

1) npm install
2) npm run local

### frontEnd
1) npm install
2) npm run dev
