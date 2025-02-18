import { ethers } from "ethers"; 
import { wrapAsync } from "../utils/helper.js";
import { abi } from "../../abi.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { promptStructure } from "../utils/promptStructure.js";

import dotenv from "dotenv";
dotenv.config();

const gemini_api_key = process.env.GEMINI_API;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const gemConfig = promptStructure.geminiConfig

const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-pro",
    gemConfig,
});

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_SERVER);
const contractAddress = process.env.DEPLOYED_CONTRACT_ADDR;

export const tokenMint =  wrapAsync(async (request, response, next) => {
    const walletDetails = request.body.walletDetails;

    let privateKey = walletDetails.privateKey.trim(); // Remove spaces

    const userWallet = new ethers.Wallet(privateKey, provider);
    const nftContractWallet = new ethers.Contract(contractAddress, abi, userWallet);
    
    const tx = await nftContractWallet.mint();

    const receipt = await tx.wait();
    const tokenId = parseInt(receipt.logs[1].data, 16); // Convert from hex

    response.json({ success: true, transactionHash: tx.hash, tokenID: tokenId });
});

export const tokenMerge =  wrapAsync(async (request, response, next) => {
    const walletDetails = request.body.walletDetails;
    const tokenDetails = request.body.tokenDetails;

    const tokenId1 = tokenDetails[0].tokenId;
    const tokenId2 = tokenDetails[1].tokenId;

    let privateKey = walletDetails.privateKey.trim(); // Remove spaces

    const userWallet = new ethers.Wallet(privateKey, provider);
    const nftContractWallet = new ethers.Contract(contractAddress, abi, userWallet);

    const tx = await nftContractWallet.merge(tokenId1, tokenId2);
    const receipt = await tx.wait();
    const tokenId = parseInt(receipt.logs[1].data, 16); // Convert from hex

    response.json({ success: true, transactionHash: tx.hash, newTokenID: tokenId });
});

export const startAdventure =  wrapAsync(async (request, response, next) => {
    const walletDetails = request.body.walletDetails;
    const tokenDetails = request.body.tokenDetails;
    const stories = request.body.stories;

    const tokenId = tokenDetails.tokenId;
    const level = tokenDetails.level;
    const heroClass = tokenDetails.class;
    const xp = tokenDetails.xp;

    let privateKey = walletDetails.privateKey.trim(); // Remove spaces

    const userWallet = new ethers.Wallet(privateKey, provider);
    const nftContractWallet = new ethers.Contract(contractAddress, abi, userWallet);

    let prompt = promptStructure.prompt;
    let levelToCharacters = promptStructure.levelToCharacters;

    let selectedWordCount = 500; //max characters

    for (const [key, value] of Object.entries(levelToCharacters)) {
        if (Number(level) <= key) {
            selectedWordCount = value;
            break; // Stop at the first valid value
        }
    }

    prompt = prompt.replace("{wordCount}", selectedWordCount)
    prompt = prompt.replace("{hero}", heroClass)
    prompt = prompt.replace("{currentXP}", xp)
    prompt = prompt.replace("{level}", level)

    prompt = promptStructure.botRole + prompt

    if(stories){
        prompt += promptStructure.previousStories
        for (let i = 0; i < stories.length; i++) {
            prompt += stories[i]
        }
    }

    let completePrompt = promptStructure.botRole + prompt
    const result = await geminiModel.generateContent(completePrompt);
    const geminiResponse = result.response.text();

    const storyJson = JSON.parse(geminiResponse)

    const tx = await nftContractWallet.startAdventure(tokenId, storyJson.story, storyJson.xpGained);
    const receipt = await tx.wait();

    response.json({ success: true, transactionHash: tx.hash });
});

export const getAdventures =  wrapAsync(async (request, response, next) => {
    const tokenId = request.body.tokenId;

    const nftContract = new ethers.Contract(contractAddress, abi, provider); // Use a read-only provider
    const [stories, currentXP, cooldownEndTime] = await nftContract.getAdventureStatus(tokenId);

    let details ={
        stories:stories,
        xp:currentXP.toString(),
        cooldownEndTime:cooldownEndTime.toString(),
    }

    response.json({ success: true, ...details });
});
