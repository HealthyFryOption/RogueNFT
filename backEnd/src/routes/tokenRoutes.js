import express from "express";
import { tokenMint, tokenMerge, startAdventure, getAdventures } from "../controllers/tokenController.js";

const tokenRouter = express.Router();

tokenRouter.post("/mint", tokenMint);
tokenRouter.post("/merge", tokenMerge);
tokenRouter.post("/adventure", startAdventure);
tokenRouter.post("/get-adventures", getAdventures);

export default tokenRouter;