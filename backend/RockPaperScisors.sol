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