// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract RogueNFT is ERC721Enumerable {
    uint256 private latestTokenID; // simple incremental tokenID for easy tracking
    mapping(address => uint256[]) public walletTokens; // hashmap of wallet addr key to array of tokens, for easy balance tracking
    
    // === NFT System Configs ===
    string[5] private availableClasses = ["warrior", "mage", "healer", "citizen", "merchant"];
    uint256 constant COOLDOWN_PERIOD = 5 minutes;  // Cooldown duration of 5 minutes for adventures
// === NFT System Configs ===

    // === Token Metadatas ===
    mapping(uint256 => uint256) public rogueLevels;
    mapping(uint256 => string) public rogueClasses;
    mapping(uint256 => uint256) public rogueXP; 

    mapping(uint256 => uint256) public adventureCooldown;  // Track the cooldown for each token
    mapping(uint256 => string[]) public adventureStories;  // Store multiple adventure stories
    // === Token Metadatas ===

    constructor() ERC721("RogueNFT", "RONFT") {}

    // Events to propagate significant actions and transactions of this contract
    event Minted(uint256 tokenId);
    event Merged(uint256 tokenId);
    event AdventureStarted(uint256 tokenId, string story, uint256 xpGained);

    // Mint new tokens (unlimited mints per wallet)
    function mint() public {
        uint256 tokenId = latestTokenID;
        uint256 nftLevel = randomRogueLevel(tokenId);
        string memory nftClass = randomRogueClass(tokenId);

        _safeMint(msg.sender, tokenId);  // Mint the token under sender address

        // ===== NFT MetaData Creation =====
        rogueLevels[tokenId] = nftLevel;
        rogueClasses[tokenId] = nftClass;
        rogueXP[tokenId] = 0;  // Initialize XP to 0
        adventureCooldown[tokenId] = 0;
        walletTokens[msg.sender].push(tokenId);  // Add tokenId to sender address key
        // ===== NFT MetaData Creation =====

        emit Minted(tokenId);

        latestTokenID++;
    }

    // Get random level for newly minted token. Seeds are current time, address, and tokenID
    function randomRogueLevel(uint256 tokenId) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % 10 + 1;
    }

    // Get random class for newly minted token out of available classes. Seeds are current time, address, and tokenID
    function randomRogueClass(uint256 tokenId) private view returns (string memory) {
        uint256 classIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % availableClasses.length;
        return availableClasses[classIndex];
    }

    // Merge two NFTs together. Must be the same owner, and same class
    function merge(uint256 tokenId1, uint256 tokenId2) public {
        require(ownerOf(tokenId1) == msg.sender, "Not owner of token 1");
        require(ownerOf(tokenId2) == msg.sender, "Not owner of token 2");

        // Check whether merging tokens are the same class
        require(
            keccak256(abi.encodePacked(rogueClasses[tokenId1])) == keccak256(abi.encodePacked(rogueClasses[tokenId2])),
            "NFT classes must be the same to merge"
        );

        uint256 newLevel = rogueLevels[tokenId1] + rogueLevels[tokenId2];
        string memory newClass = rogueClasses[tokenId1];
        uint256 newTokenId = latestTokenID;

        // Mint the token under sender address
        _safeMint(msg.sender, newTokenId); 

        // ===== NFT MetaData Creation =====
        rogueLevels[newTokenId] = newLevel;
        rogueClasses[newTokenId] = newClass;
        rogueXP[newTokenId] = 0;
        adventureCooldown[newTokenId] = 0;
        walletTokens[msg.sender].push(newTokenId);
        // ===== NFT MetaData Creation =====

        // Burn previous tokens
        _burn(tokenId1);
        _burn(tokenId2);

        // After burning, remove tokenId from walletTokens mapping and its metadata
        removeTokenFromWallet(msg.sender, tokenId1);
        removeTokenFromWallet(msg.sender, tokenId2);

        latestTokenID++;

        emit Merged(newTokenId);
    }

    // To help remove token from wallet's array of tokens owned, and remove metadata
    function removeTokenFromWallet(address wallet, uint256 tokenId) private {
        uint256 length = walletTokens[wallet].length;
        for (uint256 i = 0; i < length; i++) {
            if (walletTokens[wallet][i] == tokenId) {
                walletTokens[wallet][i] = walletTokens[wallet][length - 1];
                walletTokens[wallet].pop();
                break;
            }
        }

        // Delete metadatas for token
        delete rogueLevels[tokenId];
        delete rogueClasses[tokenId];
        delete rogueXP[tokenId];
        delete adventureCooldown[tokenId];
        delete adventureStories[tokenId];
    }

    // Get all the NFTs owned by a wallet, as well as its metadata
    function getWalletNFTDetails(address wallet) external view returns (uint256[] memory, uint256[] memory, string[] memory, uint256[] memory, uint256[] memory) {
        uint256 balance = walletTokens[wallet].length;

        uint256[] memory tokenIds = new uint256[](balance);
        uint256[] memory levels = new uint256[](balance);
        string[] memory classes = new string[](balance);
        uint256[] memory xps = new uint256[](balance);
        uint256[] memory cooldowns = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = walletTokens[wallet][i];
            tokenIds[i] = tokenId;
            levels[i] = rogueLevels[tokenId];
            classes[i] = rogueClasses[tokenId];
            xps[i] = rogueXP[tokenId];
            cooldowns[i] = adventureCooldown[tokenId];
        }

        return (tokenIds, levels, classes, xps, cooldowns);
    }

    // Allow NFTs to start their adventure, inserting a story and xp gained
    function startAdventure(uint256 tokenId, string memory story, uint256 xpGained) public {
        // Ensure that the sender owns the NFT
        require(ownerOf(tokenId) == msg.sender, "You do not own this token");

        // Ensure the token is not in cooldown
        require(block.timestamp > adventureCooldown[tokenId], "This token is on cooldown");

        // Add the new story to the stories array
        adventureStories[tokenId].push(story);

        // Add the XP to the current XP value and check if it exceeds 100
        rogueXP[tokenId] += xpGained;

        // If XP exceeds 100, level up the token and reset XP to 0
        if (rogueXP[tokenId] >= 100) {
            rogueLevels[tokenId] += 1;  // Level up
            rogueXP[tokenId] = 0;  // Reset XP to 0
        }

        // Set the cooldown time for the adventure
        adventureCooldown[tokenId] = block.timestamp + COOLDOWN_PERIOD;

        // Emit an event for the adventure
        emit AdventureStarted(tokenId, story, xpGained);
    }

    // Get all the past adventures of a given tokenID
    function getAdventureStatus(uint256 tokenId) public view returns (string[] memory stories, uint256 currentXP, uint256 cooldownEndTime) {
        stories = adventureStories[tokenId];  // All stories for the token
        currentXP = rogueXP[tokenId];  // Current XP for the token
        cooldownEndTime = adventureCooldown[tokenId];

        return (stories, currentXP, cooldownEndTime);
    }

    // Function to check if a token is on cooldown
    function isOnCooldown(uint256 tokenId) public view returns (bool) {
        // Check if the token has been on an adventure yet and is on cooldown
        return adventureCooldown[tokenId] != 0 && block.timestamp < adventureCooldown[tokenId];
    }
}
