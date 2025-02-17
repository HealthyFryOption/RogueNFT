import express from "express";
import { getAllNFTDetails } from "../controllers/walletController.js";

const walletRouter = express.Router();

walletRouter.post("/get-nfts", getAllNFTDetails);

export default walletRouter;