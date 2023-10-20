const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

// Representa el tablero del juego
const board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

wss.on('connection', (ws) => {
    ws.on("message", (message) => {
        if (gameActive) {
            const cellIndex = parseInt(message);

            if (board[cellIndex] === "") {
                board[cellIndex] = currentPlayer;
                ws.send(currentPlayer);
                
                if (checkWinner()) {
                    wss.clients.forEach((client) => {
                        client.send(`Player ${currentPlayer} wins!`);
                    });
                    gameActive = false;
                } else if (isBoardFull()) {
                    wss.clients.forEach((client) => {
                        client.send("It's a draw!");
                    });
                    gameActive = false;
                } else {
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                }
            }
        }
    });
});

// Verificar si hay un ganador
function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }

    return false;
}

// Verificar si el tablero está lleno (empate)
function isBoardFull() {
    return board.every(cell => cell !== "");
}

server.listen(3000, () => {
    console.log("Server connected to port 3000");
});
