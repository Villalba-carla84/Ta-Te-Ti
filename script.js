// Obtener todas las celdas del tablero
const cells = document.querySelectorAll(".cell");
const winnerMessage = document.getElementById("winner");
let currentPlayer = 'X'; // Declaración de currentPlayer
let gameActive = true; // Declaración de gameActive


// Función que se ejecuta al hacer clic en una celda
function handleCellClick(event) {
    if (gameActive) {
        const cell = event.target;
        const cellIndex = Array.from(cell.parentElement.children).indexOf(cell);

        if (!cell.classList.contains("X") && !cell.classList.contains("O")) {
            cell.classList.add(currentPlayer);

            // Enviar la celda seleccionada al servidor
            ws.send(cellIndex.toString());

            // Comprobar si se ganó el juego o si es un empate
            checkGameResult();

            // Cambiar el turno
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            displayCurrentPlayer();// Actualizar el jugador actual en el tablero
        }
    }
}

// Agregar un manejador de clic para cada celda
cells.forEach(cell => cell.addEventListener("click", handleCellClick));

// Configurar WebSockets
const ws = new WebSocket("ws://192.168.0.113:3000");
ws.addEventListener("open", () => {
    console.log("WebSocket connection established");
});

// Escuchar mensajes del servidor
ws.addEventListener("message", (event) => {
    const message = event.data;

    if (message === "X" || message === "O") {
        currentPlayer = message;
        winnerMessage.textContent = `Es el turno de ${currentPlayer}`;
    } else {
        winnerMessage.textContent = message;
        gameActive = false;
    }
});
function checkGameResult() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]              // Diagonales
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (cells[a].classList.contains(currentPlayer) &&
            cells[b].classList.contains(currentPlayer) &&
            cells[c].classList.contains(currentPlayer)) {
            winnerMessage.textContent = `${currentPlayer} ganó`;
            gameActive = false;
            return;
        }
    }

    const isBoardFull = Array.from(cells).every(cell => cell.classList.contains("X") || cell.classList.contains("O"));
    if (isBoardFull) {
        winnerMessage.textContent = "Empate";
        gameActive = false;
    }
}

function displayCurrentPlayer() {
    const currentPlayerDisplay = document.getElementById("currentPlayer");
    currentPlayerDisplay.textContent = `Turno de ${currentPlayer}`;
}

