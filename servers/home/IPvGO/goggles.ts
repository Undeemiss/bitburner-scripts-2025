import { AutocompleteData, GoOpponent } from "@/NetscriptDefinitions";
type BoardSize = 5 | 7 | 9 | 13;

/** @param {NS} ns */
export async function main(ns: NS) {
    // Optionally, use the first arg for board size.
    let boardSize: BoardSize = 13;
    if ([5, 7, 9, 13].includes(Number(ns.args[0]))) {
        boardSize = <BoardSize>ns.args.shift();
    }

    // Target the requested factions, or all of them excluding w0rld_d43m0n ('????????????') by default
    let factions = <GoOpponent[]>ns.args;
    if (factions.length == 0) {
        factions = ['Netburners', 'Slum Snakes', 'The Black Hand', 'Tetrads', 'Daedalus', 'Illuminati'];
    }

    // Rotate through the factions, playing all of them.
    for (let i = 0; true; i = (i + 1) % factions.length) {
        ns.go.resetBoardState(factions[i], boardSize);
        await playOneGame(ns);
        await ns.sleep(0);
    }

}

async function playOneGame(ns: NS) {
    let result: any, x: number, y: number;

    do {
        const board = ns.go.getBoardState();
        const validMoves = ns.go.analysis.getValidMoves();


        let [x, y] = getConnectedMove(board, validMoves);
        if (x === undefined) {
            [x, y] = getRandomMove(board, validMoves);
        }

        if (x === undefined) {
            // Pass turn if no moves are found
            result = await ns.go.passTurn();
        } else {
            // Play the selected move
            result = await ns.go.makeMove(x, y);
        }

        // Log opponent's next move, once it happens
        await ns.go.opponentNextTurn();

        // Keep looping as long as the opponent is playing moves
    } while (result?.type !== "gameOver");
}

/**
 * Choose one of the connected points on the board at random to play
 */
const getConnectedMove = (board: string[], validMoves: boolean[][]) => {
    const moveOptions = [];
    const size = board[0].length;

    // Look through all the points on the board
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            // Make sure the point is a valid move
            const isValidMove = validMoves[x][y] === true;
            // Leave some spaces to make it harder to capture our pieces.
            // We don't want to run out of empty node connections!
            const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;

            function isConnected(board: string[], position: [number, number]) {
                let connected = false;
                if (x < board[0].length - 1) {
                    connected = connected || (board[x + 1][y] == 'X');
                }
                if (x > 0) {
                    connected = connected || (board[x - 1][y] == 'X');
                }
                if (y < board[0].length - 1) {
                    connected = connected || (board[x][y + 1] == 'X');
                }
                if (y > 0) {
                    connected = connected || (board[x][y - 1] == 'X');
                }
                return connected;
            }

            if (isValidMove && isNotReservedSpace && isConnected(board, [x, y])) {
                moveOptions.push([x, y]);
            }
        }
    }

    // Choose one of the found moves at random
    const randomIndex = Math.floor(Math.random() * moveOptions.length);
    return moveOptions[randomIndex] ?? [];
};

/**
 * Choose one of the empty points on the board at random to play
 */
const getRandomMove = (board: string[], validMoves: boolean[][]) => {
    const moveOptions = [];
    const size = board[0].length;

    // Look through all the points on the board
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            // Make sure the point is a valid move
            const isValidMove = validMoves[x][y] === true;
            // Leave some spaces to make it harder to capture our pieces.
            // We don't want to run out of empty node connections!
            const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;

            if (isValidMove && isNotReservedSpace) {
                moveOptions.push([x, y]);
            }
        }
    }

    // Choose one of the found moves at random
    const randomIndex = Math.floor(Math.random() * moveOptions.length);
    return moveOptions[randomIndex] ?? [];
};

export function autocomplete(data: AutocompleteData) {
    return [...[5, 7, 9, 13], ...['Netburners', 'Slum Snakes', 'The Black Hand', 'Tetrads', 'Daedalus', 'Illuminati', '????????????'], '--tail'];
}