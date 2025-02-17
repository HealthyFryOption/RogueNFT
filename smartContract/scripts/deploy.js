const hre = require("hardhat");

async function main() {
    const RogueNFT = await hre.ethers.getContractFactory("RogueNFT");
    const contract = await RogueNFT.deploy();

    await contract.waitForDeployment();
    console.log("Contract deployed at:", contract.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
