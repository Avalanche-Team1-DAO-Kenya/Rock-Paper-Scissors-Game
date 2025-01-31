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