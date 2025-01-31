# Rock-Paper-Scissors-Game
Group 8


Step-by-Step Guide to Building a Rock Paper Scissors App on Avalanche

This guide will help you set up the backend (smart contract) and frontend (React app) and deploy your Rock Paper Scissors game on Avalanche Fuji Testnet.


---

1. Set Up the Project

Install Dependencies

Open a terminal and run:

# Create project folder
mkdir rock-paper-scissors && cd rock-paper-scissors

# Initialize backend for smart contract
mkdir backend && cd backend
npm init -y  # Initialize a Node.js project

# Install Hardhat
npm install --save-dev hardhat
npx hardhat # Select "Create a basic project"

# Install dependencies
npm install ethers hardhat-ethers dotenv @openzeppelin/contracts


---

2. Write the Smart Contract

Create a file backend/contracts/RockPaperScissors.sol:

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Move { Rock, Paper, Scissors }

    struct Game {
        address player1;
        address player2;
        Move move1;
        Move move2;
        bool player1Played;
        bool player2Played;
    }

    mapping(uint256 => Game) public games;
    uint256 public gameCounter;

    function createGame(address _player2) external {
        games[gameCounter] = Game(msg.sender, _player2, Move.Rock, Move.Rock, false, false);
        gameCounter++;
    }

    function playMove(uint256 gameId, Move _move) external {
        Game storage game = games[gameId];
        require(msg.sender == game.player1 || msg.sender == game.player2, "Not a player");

        if (msg.sender == game.player1) {
            require(!game.player1Played, "Already played");
            game.move1 = _move;
            game.player1Played = true;
        } else {
            require(!game.player2Played, "Already played");
            game.move2 = _move;
            game.player2Played = true;
        }
    }

    function getWinner(uint256 gameId) external view returns (string memory) {
        Game storage game = games[gameId];
        require(game.player1Played && game.player2Played, "Game not complete");

        if (game.move1 == game.move2) return "Draw";
        if (
            (game.move1 == Move.Rock && game.move2 == Move.Scissors) ||
            (game.move1 == Move.Paper && game.move2 == Move.Rock) ||
            (game.move1 == Move.Scissors && game.move2 == Move.Paper)
        ) {
            return "Player 1 Wins";
        }
        return "Player 2 Wins";
    }
}


---

3. Configure Hardhat

Edit backend/hardhat.config.js:

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    avalancheFuji: {
      url: process.env.AVALANCHE_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};


---

4. Deploy the Smart Contract

Create a Deployment Script

Create a file backend/scripts/deploy.js:

const hre = require("hardhat");

async function main() {
    const RPS = await hre.ethers.getContractFactory("RockPaperScissors");
    const rps = await RPS.deploy();
    await rps.deployed();
    console.log("RockPaperScissors deployed to:", rps.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

Add Environment Variables

Create a .env file in backend/:

AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key_here

Compile and Deploy

# Compile the smart contract
npx hardhat compile

# Deploy to Avalanche Fuji Testnet
npx hardhat run scripts/deploy.js --network avalancheFuji

Copy the deployed contract address for the frontend.


---

5. Set Up the Frontend

Create a React App

cd ..
npx create-react-app frontend
cd frontend
npm install ethers

Connect Frontend to Smart Contract

In frontend/src/App.js:

import React, { useState } from "react";
import { ethers } from "ethers";
import RockPaperScissorsABI from "./contract/RockPaperScissors.json";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, RockPaperScissorsABI, signer);

function App() {
    const [opponent, setOpponent] = useState("");
    const [gameId, setGameId] = useState("");
    const [move, setMove] = useState("");

    async function createGame() {
        await contract.createGame(opponent);
    }

    async function playMove() {
        await contract.playMove(gameId, move);
    }

    return (
        <div>
            <h1>Rock Paper Scissors on Avalanche</h1>
            
            <h2>Create Game</h2>
            <input type="text" placeholder="Opponent Address" onChange={(e) => setOpponent(e.target.value)} />
            <button onClick={createGame}>Create</button>

            <h2>Play Move</h2>
            <input type="text" placeholder="Game ID" onChange={(e) => setGameId(e.target.value)} />
            <select onChange={(e) => setMove(e.target.value)}>
                <option value="0">Rock</option>
                <option value="1">Paper</option>
                <option value="2">Scissors</option>
            </select>
            <button onClick={playMove}>Play</button>
        </div>
    );
}

export default App;


---

6. Start the Frontend

Replace contract ABI in frontend/src/contract/RockPaperScissors.json (copy from backend/artifacts/contracts/RockPaperScissors.sol/RockPaperScissors.json).

Start the frontend:

cd frontend
npm start

Your Rock Paper Scissors app will open in a browser.


---

7. Deploy to Avalanche C-Chain (Mainnet)

After testing on Fuji Testnet, update .env:

AVALANCHE_RPC=https://api.avax.network/ext/bc/C/rpc
PRIVATE_KEY=your_mainnet_private_key

Then deploy:

npx hardhat run scripts/deploy.js --network avalancheFuji


---

Summary of Commands

Backend (Smart Contract)

mkdir backend && cd backend
npm init -y
npm install --save-dev hardhat
npx hardhat
npm install ethers hardhat-ethers dotenv @openzeppelin/contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network avalancheFuji

Frontend (React App)

cd ..
npx create-react-app frontend
cd frontend
npm install ethers
npm start


---

Next Steps

Enhance UI with a better design (e.g., Material UI or Tailwind CSS).

Add MetaMask authentication to auto-connect users.

Improve security (e.g., use commit-reveal scheme for hiding moves).

Deploy to Mainnet once tested.

