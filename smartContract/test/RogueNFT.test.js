const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RogueNFT Contract", function () {
    let rogueNFT, addr1, addr2;

    beforeEach(async function () {
        [addr1, addr2] = await ethers.getSigners();
        rogueNFT = await ethers.deployContract("RogueNFT");
    });

    it("Should mint an NFT and assign correct metadata", async function () {
        await rogueNFT.connect(addr1).mint();

        // Minted correctly
        expect(await rogueNFT.balanceOf(addr1.address)).to.equal(1);

        // First tokenID is 0
        const tokenId = 0;

        const level = await rogueNFT.rogueLevels(tokenId);
        const heroClass = await rogueNFT.rogueClasses(tokenId);
        const xp = await rogueNFT.rogueXP(tokenId);

        expect(level).to.be.gte(1).and.lte(10);
        expect(heroClass).to.be.a("string");
        expect(xp).to.equal(0); // xp for newly minted is 0
    });

    it("Should allow merging of two NFTs of the rogue class", async function () {
        await rogueNFT.connect(addr1).mint();
        await rogueNFT.connect(addr1).mint();

        const tokenId1 = 0;
        const tokenId2 = 1;

        const class1 = await rogueNFT.rogueClasses(tokenId1);
        const class2 = await rogueNFT.rogueClasses(tokenId2);

        if (class1 !== class2) {
            this.skip(); // Skip test if classes are not the same
        }
        
        // if possible merge of two same hero class
        await rogueNFT.connect(addr1).merge(tokenId1, tokenId2);

        // tokens merged are burnt, so addr1 should only have one token
        expect(await rogueNFT.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should prevent merging of different rogue classes", async function () {
        await rogueNFT.connect(addr1).mint();
        await rogueNFT.connect(addr1).mint();

        const tokenId1 = 0;
        const tokenId2 = 1;

        const class1 = await rogueNFT.rogueClasses(tokenId1);
        const class2 = await rogueNFT.rogueClasses(tokenId2);

        if (class1 === class2) {
            this.skip(); // Skip test if classes are the same
        }

        await expect(rogueNFT.connect(addr1).merge(tokenId1, tokenId2)).to.be.revertedWith(
            "NFT classes must be the same to merge"
        );
    });

    it("Should allow an NFT to go on an adventure", async function () {
        await rogueNFT.connect(addr1).mint();
        const tokenId = 0;

        const story = "Goran embarks on a journey to slay the dragon.";
        const xpGained = 20;

        await rogueNFT.connect(addr1).startAdventure(tokenId, story, xpGained);

        const adventureData = await rogueNFT.getAdventureStatus(tokenId);

        expect(adventureData[0]).to.include(story); // story kept is an array
        expect(adventureData[1]).to.equal(xpGained);
    });

    it("Should prevent adventures while on cooldown", async function () {
        await rogueNFT.connect(addr1).mint();
        const tokenId = 0;

        const story = "First adventure.";
        await rogueNFT.connect(addr1).startAdventure(tokenId, story, 20);

        // Need to wait 5 minutes to continue adventures
        await expect(
            rogueNFT.connect(addr1).startAdventure(tokenId, "Second adventure.", 20)
        ).to.be.revertedWith("This token is on cooldown");
    });
});
