import { CodingContractSignatures } from "@/NetscriptDefinitions";

export function findLargestPrimeFactor(n) {
    //Special case for 2
    //While n is divisible by i, divide by i
    while (n % 2 == 0) {
        n /= 2;
    }
    if (n == 1) {
        // throw "Would return " + 2;
        return i;
    }

    //Iterate over odd numbers until the largest prime factor of $
    for (var i = 3; i <= Math.sqrt(n); i += 2) {

        //While n is divisible by i, divide by i
        while (n % i == 0) {
            n /= i;
        }
        if (n == 1) {
            // throw "Would return " + i;
            return i;
        }
    }

    // throw "Would return " + n;
    return n;
}

export function subarrayWithMaximumSum(input) {
    function sum(array) {
        var sum = 0;
        for (var i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum;
    }

    var max = input[0];
    var score;

    //For each subarray of input starting with input[i] and ending with input[j]
    for (var i = 0; i < input.length; i++) {
        for (var j = i; j < input.length + 1; j++) {
            //Obtain the score of the subarray
            score = sum(input.slice(i, j));

            //If the score is a new best, save it
            if (score > max) {
                max = score;
            }
        }
    }
    return max;
}

export function totalWaysToSum(n) {
    //Initialize list with 0s
    var list = [];
    for (var i = 1; i <= n; i++) {
        list[i] = 0;
    }

    // Base case
    list[0] = 1;

    //For each item in the list except the first
    for (var i = 1; i < n; i++) {
        //For every item in the list at or after i
        for (var j = i; j <= n; j++) {
            //Consider the ways to write j by taking (i) + (some way to write j-i without values > i)
            list[j] += list[j - i];
        }
    }

    //Return the final value
    return list[n];
}

//TODO: totalWaysToSumIi

export function spiralizeMatrix(matrix) {
    //If the matrix given is empty (base case)
    if (!matrix?.length || !matrix[0]?.length) {
        return [];
    }

    //Top part of the matrix
    var top = matrix[0];
    // ns.tprint("top = " + top);


    //Right hand side of the matrix
    var right = [];
    //The x-coordinate of the right side
    var x = matrix[0].length - 1;
    //Iterate forwards through rows after the first
    for (var i = 1; i < matrix.length; i++) {
        //Add the rightmost element of the ith row to right
        right.push(matrix[i][x]);
    }
    // ns.tprint("right = " + right);

    //Bottom part of the matrix
    var bottom = [];
    //Prevent double-counting if there is only 1 row
    if (matrix.length > 1) {
        //The y-coordinate of the bottom
        var y = matrix.length - 1;
        //Iterate backwards through columns before the last
        for (var i = matrix[0].length - 2; i >= 0; i--) {
            //Add the bottom element of the ith column to bottom
            bottom.push(matrix[y][i]);
        }
    }
    // ns.tprint("bottom = " + bottom);

    //Left hand side of the matrix
    var left = [];
    //Prevent double-counting if there is only 1 column
    if (matrix[0].length > 1) {
        //Iterate backwards through rows after the last and before the first
        for (var i = matrix.length - 2; i > 0; i--) {
            //Add the leftmost element of the ith row to right
            left.push(matrix[i][0]);
        }
        // ns.tprint("left = " + left);
    }

    var minimatrix = [];
    //Iterate through rows except the first and last
    for (var i = 1; i < matrix.length - 1; i++) {

        var row = [];
        //Iterate through columns except the first and last
        for (var j = 1; j < matrix[0].length - 1; j++) {
            //Add the item to row
            row.push(matrix[i][j]);
        }
        //Add the row to minimatrix
        minimatrix.push(row);
    }

    //Return the answer, recursively handling the insides
    return [].concat.apply([], [top, right, bottom, left, spiralizeMatrix(minimatrix)]);
}

export function arrayJumpingGame(input) {
    var maxPos = 0;
    for (var i = 0; i <= maxPos; i++) {
        maxPos = Math.max(maxPos, i + input[i]);
        if (maxPos >= input.length - 1) {
            return 1;
        }
    }
    return 0;
}

//TODO: arrayJumpingGameIi

export function mergeOverlappingIntervals(input) {

    //Tag numbers from interval[0] to interval[1]-1 as included
    function accumulate(accumulator, interval) {
        for (var i = interval[0]; i < interval[1]; i++) {
            accumulator[i] = true;
        }
    }

    function compile(intervals, accumulator, startAt) {

        //Find the first number included in the interval.
        while (accumulator[startAt] == undefined && startAt < accumulator.length) {
            startAt++;
        }
        //If startAt exceeds the length of the accumulator, we are done.
        if (startAt >= accumulator.length - 1) {
            return;
        }

        //Find the first number not included in the interval
        var endAt = startAt + 1;
        while (accumulator[endAt] == true) {
            endAt++;
        }

        //Add the interval to intervals
        intervals.push([startAt, endAt]);

        //Recursively compile the remaining intervals
        compile(intervals, accumulator, endAt + 1);
        return intervals;
    }

    var accumulator = [];
    //Accumulate the net interval
    for (var i = 0; i < input.length; i++) {
        accumulate(accumulator, input[i]);
    }

    return compile([], accumulator, 0);
}

export function generateIpAddresses(input) {
    function getIps(digits) {
        var ips = [];
        //Iterate over all places the dots can be placed.
        //Each dot must have at least one character on each side.
        for (var dot1pos = 1; dot1pos <= 3; dot1pos++) {
            for (var dot2pos = 1; dot2pos <= 3; dot2pos++) {
                for (var dot3pos = 1; dot3pos <= 3; dot3pos++) {
                    //Generate the 4 parts of the IP
                    var parts = [
                        digits.substring((0), (dot1pos)),
                        digits.substring((dot1pos), (dot1pos + dot2pos)),
                        digits.substring((dot1pos + dot2pos), (dot1pos + dot2pos + dot3pos)),
                        digits.substring(dot1pos + dot2pos + dot3pos)
                    ];
                    var isValid = true;
                    //Check the validity of the parts
                    for (var i = 0; i < 4; i++) {
                        //Mark the parts as invalid if they aren't possible.
                        //There must be at least 1 digit per part
                        //No part can have a leading 0 unless it is 0
                        //No part can have a value greater than 255
                        if ((parts[i].length == 0) ||
                            // (parts[i].length > 3) ||
                            ((parts[i].charAt(0) == "0") && (parts[i].length != 1)) ||
                            (parts[i] > 255)) {
                            isValid = false;
                            break;
                        }
                    }
                    //If the IP is valid, add its string form to ips
                    if (isValid) {
                        ips.push(parts[0] + "." + parts[1] + "." + parts[2] + "." + parts[3]);
                    }

                }
            }
        }
        return ips;
    }

    var digits = input;
    if (digits.length > 12) return [""];
    var output = getIps(digits);
    return output;
}

export function algorithmicStockTraderI(input) {
    //Get all possible investment plans that use k or less transactions.
    //2D array with input[0]+1 rows used for cache because k will always be <= input[0].
    //This causes input[0] = [], which is wasteful, but it makes the coding easier.
    //The cache is passed by value of the pointer, so the underlying data is shared
    //between each recursion.
    function possibleProfit(k, prices, startFrom, cache) {
        //If no transaction is available
        if (k == 0) {
            return 0;
        }

        //Use cached value if applicable
        if (cache[k][startFrom] != undefined) {
            return cache[k][startFrom];
        }

        var best = 0;
        //For all valid transactions buying at i and selling at j
        for (var i = startFrom; i + 1 < prices.length; i++) {
            for (var j = i + 1; j < prices.length; j++) {
                //If this transaction brings a profit
                if (prices[j] - prices[i] > 0) {
                    //Get the best plan starting with this transaction
                    var childProfit = possibleProfit(k - 1, prices, j + 1, cache);
                    best = Math.max(best, prices[j] - prices[i] + childProfit);
                }
            }
        }

        //Cache the value so this calculation is less likely to be repeated
        cache[k][startFrom] = best;

        return best;
    }

    var cache = [];
    for (var i = 0; i < input[0] + 1; i++) {
        cache[i] = [];
    }

    return possibleProfit(1, input, 0, cache);
}

export function algorithmicStockTraderIi(input) {
    //Get all possible investment plans that use k or less transactions.
    //2D array with input[0]+1 rows used for cache because k will always be <= input[0].
    //This causes input[0] = [], which is wasteful, but it makes the coding easier.
    //The cache is passed by value of the pointer, so the underlying data is shared
    //between each recursion.
    function possibleProfit(k, prices, startFrom, cache) {
        //If no transaction is available
        if (k == 0) {
            return 0;
        }

        //Use cached value if applicable
        if (cache[k][startFrom] != undefined) {
            return cache[k][startFrom];
        }

        var best = 0;
        //For all valid transactions buying at i and selling at j
        for (var i = startFrom; i + 1 < prices.length; i++) {
            for (var j = i + 1; j < prices.length; j++) {
                //If this transaction brings a profit
                if (prices[j] - prices[i] > 0) {
                    //Get the best plan starting with this transaction
                    var childProfit = possibleProfit(k - 1, prices, j + 1, cache);
                    best = Math.max(best, prices[j] - prices[i] + childProfit);
                }
            }
        }

        //Cache the value so this calculation is less likely to be repeated
        cache[k][startFrom] = best;

        return best;
    }

    var cache = [];
    for (var i = 0; i < input[0] + 1; i++) {
        cache[i] = [];
    }

    return possibleProfit(Infinity, input, 0, cache);
}

export function algorithmicStockTraderIii(input) {
    //Get all possible investment plans that use k or less transactions.
    //2D array with input[0]+1 rows used for cache because k will always be <= input[0].
    //This causes input[0] = [], which is wasteful, but it makes the coding easier.
    //The cache is passed by value of the pointer, so the underlying data is shared
    //between each recursion.
    function possibleProfit(k, prices, startFrom, cache) {
        //If no transaction is available
        if (k == 0) {
            return 0;
        }

        //Use cached value if applicable
        if (cache[k][startFrom] != undefined) {
            return cache[k][startFrom];
        }

        var best = 0;
        //For all valid transactions buying at i and selling at j
        for (var i = startFrom; i + 1 < prices.length; i++) {
            for (var j = i + 1; j < prices.length; j++) {
                //If this transaction brings a profit
                if (prices[j] - prices[i] > 0) {
                    //Get the best plan starting with this transaction
                    var childProfit = possibleProfit(k - 1, prices, j + 1, cache);
                    best = Math.max(best, prices[j] - prices[i] + childProfit);
                }
            }
        }

        //Cache the value so this calculation is less likely to be repeated
        cache[k][startFrom] = best;

        return best;
    }

    var cache = [];
    for (var i = 0; i < input[0] + 1; i++) {
        cache[i] = [];
    }

    return possibleProfit(2, input, 0, cache);
}

export function algorithmicStockTraderIv(input) {
    //Get all possible investment plans that use k or less transactions.
    //2D array with input[0]+1 rows used for cache because k will always be <= input[0].
    //This causes input[0] = [], which is wasteful, but it makes the coding easier.
    //The cache is passed by value of the pointer, so the underlying data is shared
    //between each recursion.
    function possibleProfit(k, prices, startFrom, cache) {
        //If no transaction is available
        if (k == 0) {
            return 0;
        }

        //Use cached value if applicable
        if (cache[k][startFrom] != undefined) {
            return cache[k][startFrom];
        }

        var best = 0;
        //For all valid transactions buying at i and selling at j
        for (var i = startFrom; i + 1 < prices.length; i++) {
            for (var j = i + 1; j < prices.length; j++) {
                //If this transaction brings a profit
                if (prices[j] - prices[i] > 0) {
                    //Get the best plan starting with this transaction
                    var childProfit = possibleProfit(k - 1, prices, j + 1, cache);
                    best = Math.max(best, prices[j] - prices[i] + childProfit);
                }
            }
        }

        //Cache the value so this calculation is less likely to be repeated
        cache[k][startFrom] = best;

        return best;
    }

    var cache = [];
    for (var i = 0; i < input[0] + 1; i++) {
        cache[i] = [];
    }

    return possibleProfit(input[0], input[1], 0, cache);
}

export function minimumPathSumInATriangle(input) {
    function scoreRow(row, lastScore) {
        var scores = [];

        //Handle the leftmost item in the row
        scores[0] = lastScore[0] + row[0];

        //Handle middle items in the row
        for (var i = 1; i < row.length - 1; i++) {
            //Take the shortest path to this location
            scores[i] = row[i] + Math.min(lastScore[i - 1], lastScore[i]);
        }

        //Handle the rightmost item in the row
        scores[row.length - 1] = lastScore[row.length - 2] + row[row.length - 1];

        return scores;
    }

    //Set the current scores array to the topmost element of the triangle
    var scores = input[0];

    //Score each row, saving only the final result
    for (var i = 1; i < input.length; i++) {
        scores = scoreRow(input[i], scores);
    }

    var answer = Math.min(...scores);
    return answer;
}

export function uniquePathsInAGridI(input) {
    //Goal stored as [x,y]
    var goal = [input[0] - 1, input[1] - 1];
    //List of positions reached by unique paths
    var frontier = [[0, 0]];
    //Number of successfully finished paths
    var paths = 0;
    while (frontier?.length) {
        //Get the current position
        var pos = frontier.pop();

        //If the path was successful, add to paths
        if (pos[0] == goal[0] && pos[1] == goal[1]) {
            paths++;
        }
        //Invalid path case; end the path here
        else if (pos[0] > goal[0] || pos[1] > goal[1]) {
            //Do nothing
        }
        //Valid but incomplete path case, extend it in both directions
        else {
            // ns.tprint(pos + " is valid");
            frontier.push([pos[0] + 1, pos[1]]);
            frontier.push([pos[0], pos[1] + 1]);
        }
    }

    return paths;
}

export function uniquePathsInAGridIi(input) {
    //Goal stored as [x,y]
    var goal = [input[0].length - 1, input.length - 1];
    //List of positions reached by unique paths
    var frontier = [[0, 0]];
    //Number of successfully finished paths
    var paths = 0;
    while (frontier?.length) {
        //Get the current position
        var pos = frontier.pop();

        //If the path was successful, add to paths
        if (pos[0] == goal[0] && pos[1] == goal[1]) {
            paths++;
        }
        //Invalid path case; end the path here
        else if (pos[0] > goal[0] || pos[1] > goal[1] || input[pos[1]][pos[0]] == 1) {
            //Do nothing
        }
        //Valid but incomplete path case, extend it in both directions
        else {
            // ns.tprint(pos + " is valid");
            frontier.push([pos[0] + 1, pos[1]]);
            frontier.push([pos[0], pos[1] + 1]);
        }
    }

    return paths;
}

//TODO: shortestPathInAGrid

export function sanitizeParenthesesInExpression(input) {
    function remParen(strings) {
        var newStrings = [];

        //For each string in strings
        while (strings?.length) {

            var string = strings.pop();
            // ns.tprint(string);

            //For each character in the string
            for (var i = 0; i < string.length; i++) {

                // ns.tprint("string.charAt(i) = " + string.charAt(i));
                //If the character in question is a paren
                if (string.charAt(i) == "(" || string.charAt(i) == ")") {

                    //Create a copy of the string without this paren
                    var newString = string.slice(0, i) + string.slice(i + 1);
                    // ns.tprint("Creating new string " + newString);

                    //If the created string is unique, add it to newStrings
                    if (!newStrings.includes(newString)) {
                        newStrings.push(newString);
                    }
                }
            }
        }

        // ns.tprint(newStrings);
        return newStrings;
    }

    function filterCond(string) {
        //Initially, there are no parens open
        var parens = 0;

        //For each character in the string
        for (var i = 0; i < string.length; i++) {
            //Open paren case
            if (string.charAt(i) == "(") {
                parens++;
            }
            //Close paren case
            else if (string.charAt(i) == ")") {
                parens--;
                //If parens are closed without opening, return false
                if (parens < 0) return false;
            }
        }

        //Return true iff every opened paren has been closed
        return (parens == 0);
    }

    //Create the initial string
    var strings = [input];
    var filtered = strings.filter(filterCond);

    //While there are no valid strings
    while (filtered.length == 0) {
        strings = remParen(strings);
        filtered = strings.filter(filterCond);
    }

    return filtered;
}

export function findAllValidMathExpressions(input) {

    function addDigit(oldExpressions, digit) {
        var newExpressions = [];
        for (var i = 0; i < oldExpressions.length; i++) {
            // while(oldExpressions?.length){
            var oldExpression = oldExpressions[i];
            // var oldExpression = oldExpressions.pop();
            if (oldExpression.length > 50) {
                throw "something has gone terribly wrong";
            }

            //+ case
            newExpressions.push(oldExpression + "+" + digit);
            //- case
            newExpressions.push(oldExpression + "-" + digit);
            //* case
            newExpressions.push(oldExpression + "*" + digit);

            //No operator case; don't create numbers with leading 0s
            if (oldExpression.charAt(oldExpression.length - 1) != '0') {
                //If there is no 0, create the no operator case
                newExpressions.push(oldExpression + digit);
            } else {
                var char = oldExpression.charAt(oldExpression.length - 2);
                if ((char != '+') && (char != '-') && (char != '*')) {
                    //If there is a 0 but it comes after a digit, still create the no operator case
                    newExpressions.push(oldExpression + digit);
                }
            }
        }
        return newExpressions;
    }

    var digits = input[0];
    var target = input[1];

    //Generate all possible expressions
    var expressions = [digits.charAt(0)];
    for (var i = 1; i < digits.length; i++) {
        //Add one digit to the graph in each of the 3 or 4 possible ways.
        expressions = addDigit(expressions, digits.charAt(i));
    }

    //Pick the "valid" expressions out of the list
    var validExpressions = [];
    for (var i = 1; i < expressions.length; i++) {
        //Check if the expression is equal to the target
        if (eval(expressions[i]) == target) {
            validExpressions.push(expressions[i]);
        }
    }

    return validExpressions;
}

//TODO: hammingcodesIntegerToEncodedBinary

//TODO: hammingcodesEncodedBinaryToInteger

export function proper2coloringOfAGraph(data) {

    //Helper function to get neighbourhood of a vertex
    function neighbourhood(vertex) {
        const adjLeft = data[1].filter(([a, _]) => a == vertex).map(([_, b]) => b);
        const adjRight = data[1].filter(([_, b]) => b == vertex).map(([a, _]) => a);
        return adjLeft.concat(adjRight);
    }

    //Verify that there is no solution by attempting to create a proper 2-coloring.
    const coloring = Array(data[0]).fill(undefined);
    while (coloring.some((val) => val === undefined)) {
        //Color a vertex in the graph
        const initialVertex = coloring.findIndex((val) => val === undefined);
        coloring[initialVertex] = 0;
        const frontier = [initialVertex];

        //Propogate the coloring throughout the component containing v greedily
        while (frontier.length > 0) {
            const v = frontier.pop() || 0;
            const neighbors = neighbourhood(v);

            //For each vertex u adjacent to v
            for (const id in neighbors) {
                const u = neighbors[id];

                //Set the color of u to the opposite of v's color if it is new,
                //then add u to the frontier to continue the algorithm.
                if (coloring[u] === undefined) {
                    if (coloring[v] === 0) coloring[u] = 1;
                    else coloring[u] = 0;

                    frontier.push(u);
                }

                //Assert u,v do not have the same color
                else if (coloring[u] === coloring[v]) {
                    //If u,v do have the same color, no proper 2-coloring exists, meaning
                    //the player was correct to say there is no proper 2-coloring of the graph.
                    return [];
                }
            }
        }
    }

    //If this code is reached, there exists a proper 2-coloring of the input
    //graph, and thus the player was incorrect in submitting no answer.
    return coloring;
}

export function compressionIRleCompression(data: string) {
    let outputString = '';
    let initialChar: string;
    let runLength = 0;

    // Convert a run of a single character into RLE format, and put it at the end of outputTo.
    function finalize(char: string, runLength: number) {
        let outputString = '';
        let remainingLength = runLength;
        while (remainingLength >= 1) {
            const amt = Math.min(remainingLength, 9);
            remainingLength -= amt;
            outputString += `${amt}${char}`;
        }
        return outputString;
    }

    for (const char of data) {
        if (char == initialChar) {
            runLength++
        } else {
            outputString += finalize(initialChar, runLength);
            initialChar = char;
            runLength = 1;
        }
    }
    outputString += finalize(initialChar, runLength);

    return outputString;
}

//TODO: compressionIiLzDecompression

//TODO: compressionIiiLzCompression