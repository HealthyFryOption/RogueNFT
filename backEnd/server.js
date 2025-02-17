import express from 'express';
import cors from "cors";
import { ethers } from "ethers";
import {abi} from "./abi.js"

import tokenRouter from './src/routes/tokenRoutes.js';
import walletRouter from './src/routes/walletRoutes.js';

import dotenv from "dotenv";
dotenv.config();

import { loggingMiddleware } from './src/utils/helper.js';

const corsOptions = {
    origin: 'http://localhost:3001',
    methods: "GET,POST,PUT,DELETE",
    credentials: false
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(loggingMiddleware);

app.use("/token", tokenRouter);
app.use("/wallet", walletRouter);

// Global error handler.
app.use((err, req, res, next) => {
    console.error("Error Found:", err);

    if(err.reason){
        // from contract
        res.status(401).json({message: err.reason});
    }else if(!err.status){
        // no status, runtime error 
        res.status(500).json({message: "Internal server error, please contact administrator"});
    }else if(err.status >= 400 && err.status <= 499){
        res.status(err.status).json({message: err.message});
    }else{
        res.status(500).json({message: err.message});
    }
});

app.listen(3000, () => console.log(`Server running on http://localhost:${process.env.BACKEND_PORT ?? "3000"}`));
