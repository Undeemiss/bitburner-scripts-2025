const colors = {
    green: '\x1b[32m',
    magenta: "\x1b[35m",
    white: "\x1b[37m",
    default: "\x1b[0m",
}

export function prettifyBoard(board: string[]) {
    let outputString = '';
    // Go through the board in the order to display traditionally
    for (let y = board.length - 1; y >= 0; y--) {
        for (let x = 0; x < board.length; x++) {
            // Substitute characters as necessary
            let here: string;
            switch (board[x][y]) {
                case '#': here = ' '; break;
                case 'X': here = `${colors.green}X`; break;
                case 'O': here = `${colors.magenta}O`; break;
                case '.': here = `${colors.white}.`; break;
                default: here = `${colors.default}${board[x][y]}`;
            }
            outputString += `${here} `;
        }
        if (y > 0) {
            outputString += `\n`;
        } else {
            outputString += colors.default;
        }
    }
    return outputString;
}