import { ethers } from "ethers"; 
import { wrapAsync } from "../utils/helper.js";
import { abi } from "../../abi.js";

import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_SERVER);
const contractAddress = process.env.DEPLOYED_CONTRACT_ADDR;

export const getAllNFTDetails = wrapAsync(async (request, response, next) => {
    const walletAddress= request.body.walletAddress.trim();
    if (!walletAddress) {
        return response.status(400).json({ error: "Wallet ID not provided" });
    }

    const nftContract = new ethers.Contract(contractAddress, abi, provider); // Use a read-only provider

    // Call smart contract function without signing
    const [tokenIds, levels, classes, xps, cooldowns] = await nftContract.getWalletNFTDetails(walletAddress);

    // Format the data
    let nfts = tokenIds.map((id, index) => ({
        tokenId: id.toString(),
        level: levels[index].toString(),
        class: classes[index],
        xp: xps[index].toString(),
        cooldown: cooldowns ? cooldowns[index].toString() : 0,
    }));

    response.json({nfts});
});