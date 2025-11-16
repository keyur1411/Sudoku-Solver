document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const sudokuGrid = document.getElementById("sudoku-grid");

    // Create the 9x9 grid
    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");

        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");

            input.type = "text";
            input.maxLength = 1;
            input.className = "cell";
            input.id = `cell-${row}-${col}`;

            // Only allow numbers 1-9
            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^1-9]/g, "");
            });

            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

// Sleep for animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ----------------------------
// Main solve logic
// ----------------------------

document.getElementById("solve-btn").addEventListener("click", solveSudoku);

async function solveSudoku() {
    const sudokuArray = [];

    // Read grid
    for (let row = 0; row < 9; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < 9; col++) {
            const value = document.getElementById(`cell-${row}-${col}`).value;
            sudokuArray[row][col] = value ? parseInt(value) : 0;
            document.getElementById(`cell-${row}-${col}`).classList.remove("invalid");
        }
    }

    // Validate starting board
    if (!isInitialBoardValid(sudokuArray)) {
        alert("Invalid Sudoku puzzle. Please correct highlighted cells.");
        return;
    }

    // Solve
    if (!solveSudokuHelper(sudokuArray)) {
        alert("No solution exists for this Sudoku.");
        return;
    }

    // Fill solved cells
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (cell.value === "") {
                cell.value = sudokuArray[row][col];
                cell.classList.add("solved");
                await sleep(20);
            }
        }
    }
}

// ----------------------------
// Board Validation
// ----------------------------

function isInitialBoardValid(board) {
    let isValid = true;

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = board[row][col];
            if (num !== 0) {
                board[row][col] = 0; // temporarily remove

                if (!isValidMove(board, row, col, num)) {
                    document.getElementById(`cell-${row}-${col}`).classList.add("invalid");
                    isValid = false;
                }

                board[row][col] = num;
            }
        }
    }

    return isValid;
}

// ----------------------------
// Solver + Validation
// ----------------------------

function solveSudokuHelper(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {

                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;

                        if (solveSudokuHelper(board)) return true;

                        board[row][col] = 0;
                    }
                }

                return false;
            }
        }
    }
    return true;
}

function isValidMove(board, row, col, num) {
    // Row & column check
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }

    // 3x3 grid check
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) return false;
        }
    }

    return true;
}

document.getElementById("clear-btn").addEventListener("click", clearBoard);

function clearBoard() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            cell.value = "";
            cell.classList.remove("solved");
            cell.classList.remove("invalid");
            cell.classList.remove("user-input");
        }
    }
}
