import { CodingContractName, CodingContractSignatures } from "@/NetscriptDefinitions";
type CCTSolver<T extends keyof CodingContractSignatures> = (data: CodingContractSignatures[T][0]) => CodingContractSignatures[T][1];

export const algorithmicStockTraderI: CCTSolver<CodingContractName.AlgorithmicStockTraderI> = function (input) {
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
    for (var i = 0; i < 2; i++) {
        cache[i] = [];
    }

    return possibleProfit(1, input, 0, cache);
}

export const algorithmicStockTraderIi: CCTSolver<CodingContractName.AlgorithmicStockTraderII> = function (input) {
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
        if (k < Infinity) {
            if (cache[k][startFrom] != undefined) {
                return cache[k][startFrom];
            }
        } else { // Special case for uncapped transactions
            if (cache[0][startFrom] != undefined) {
                return cache[0][startFrom];
            }
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
        if (k < Infinity) {
            cache[k][startFrom] = best;
        } else { // Special case for uncapped transactions
            cache[0][startFrom] = best;
        }

        return best;
    }

    // Special case for uncapped transactions
    var cache = [];
    cache[0] = [];

    return possibleProfit(Infinity, input, 0, cache);
}

export const algorithmicStockTraderIii: CCTSolver<CodingContractName.AlgorithmicStockTraderIII> = function (input) {
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
    for (var i = 0; i < 3; i++) {
        cache[i] = [];
    }

    return possibleProfit(2, input, 0, cache);
}

export const algorithmicStockTraderIv: CCTSolver<CodingContractName.AlgorithmicStockTraderIV> = function (input) {
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

export const arrayJumpingGame: CCTSolver<CodingContractName.ArrayJumpingGame> = function (input) {
    var maxPos = 0;
    for (var i = 0; i <= maxPos; i++) {
        maxPos = Math.max(maxPos, i + input[i]);
        if (maxPos >= input.length - 1) {
            return 1;
        }
    }
    return 0;
}

export const arrayJumpingGameIi: CCTSolver<CodingContractName.ArrayJumpingGameII> = function (data) {
    // Initialize each position except the first as unreachable.
    const jumpsRequired = [0];
    for (let i = 1; i < data.length; i++) {
        jumpsRequired[i] = Infinity;
    }

    // Iterate through each position.
    for (let i = 0; i < data.length; i++) {
        // Mark each of the spaces you can reach from i as reachable in at most one more jump than it takes to get to i
        for (let j = 1; (j < data[i] + 1) && (i + j < data.length); j++) {
            jumpsRequired[i + j] = Math.min(jumpsRequired[i + j], jumpsRequired[i] + 1);
        }
    }

    // Return the jumps to reach the final location
    const final = jumpsRequired[data.length - 1];
    if (final < Infinity) {
        return final;
    }
    else return 0;
}

export const compressionIRleCompression: CCTSolver<CodingContractName.CompressionIRLECompression> = function (data) {
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

export const compressionIiLzDecompression: CCTSolver<CodingContractName.CompressionIILZDecompression> = function (data) {
    let compressedData = data;
    let uncompressedData = '';

    while (compressedData.length > 0) {
        // Infinite loop prevention
        if (isNaN(parseInt(compressedData[0]))) {
            throw new Error(
                `compressionIiLzDecompression is in an unrecoverable state: compressedData:${compressedData}, uncompressedData:${uncompressedData}`
            );
        }

        { // Mode 1: One digit followed by raw data
            const l = parseInt(compressedData[0]);
            uncompressedData += compressedData.slice(1, l + 1);
            compressedData = compressedData.slice(l + 1);
        }

        { // Mode 2: Copy from earlier uncompressed data
            const l = parseInt(compressedData[0]);

            if (l == 0) { // Skip case
                compressedData = compressedData.slice(1);
            } else { // Actual data case
                const x = parseInt(compressedData[1]);
                for (let i = 0; i < l; i++) {
                    uncompressedData += uncompressedData[uncompressedData.length - x];
                }
                compressedData = compressedData.slice(2);
            }
        }
    }
    return uncompressedData;
}

// TODO: At least try to understand this code. Taken directly from the game src. 
export const compressionIiiLzCompression: CCTSolver<CodingContractName.CompressionIIILZCompression> = function (plain) {

    // for state[i][j]:
    //      if i is 0, we're adding a literal of length j
    //      else, we're adding a backreference of offset i and length j
    let cur_state: (string | null)[][] = Array.from(Array(10), () => Array<string | null>(10).fill(null));
    let new_state: (string | null)[][] = Array.from(Array(10), () => Array<string | null>(10));

    function set(state: (string | null)[][], i: number, j: number, str: string): void {
        const current = state[i][j];
        if (current == null || str.length < current.length) {
            state[i][j] = str;
        } else if (str.length === current.length && Math.random() < 0.5) {
            // if two strings are the same length, pick randomly so that
            // we generate more possible inputs to Compression II
            state[i][j] = str;
        }
    }

    // initial state is a literal of length 1
    cur_state[0][1] = "";

    for (let i = 1; i < plain.length; ++i) {
        for (const row of new_state) {
            row.fill(null);
        }
        const c = plain[i];

        // handle literals
        for (let length = 1; length <= 9; ++length) {
            const string = cur_state[0][length];
            if (string == null) {
                continue;
            }

            if (length < 9) {
                // extend current literal
                set(new_state, 0, length + 1, string);
            } else {
                // start new literal
                set(new_state, 0, 1, string + "9" + plain.substring(i - 9, i) + "0");
            }

            for (let offset = 1; offset <= Math.min(9, i); ++offset) {
                if (plain[i - offset] === c) {
                    // start new backreference
                    set(new_state, offset, 1, string + String(length) + plain.substring(i - length, i));
                }
            }
        }

        // handle backreferences
        for (let offset = 1; offset <= 9; ++offset) {
            for (let length = 1; length <= 9; ++length) {
                const string = cur_state[offset][length];
                if (string == null) {
                    continue;
                }

                if (plain[i - offset] === c) {
                    if (length < 9) {
                        // extend current backreference
                        set(new_state, offset, length + 1, string);
                    } else {
                        // start new backreference
                        set(new_state, offset, 1, string + "9" + String(offset) + "0");
                    }
                }

                // start new literal
                set(new_state, 0, 1, string + String(length) + String(offset));

                // end current backreference and start new backreference
                for (let new_offset = 1; new_offset <= Math.min(9, i); ++new_offset) {
                    if (plain[i - new_offset] === c) {
                        set(new_state, new_offset, 1, string + String(length) + String(offset) + "0");
                    }
                }
            }
        }

        const tmp_state = new_state;
        new_state = cur_state;
        cur_state = tmp_state;
    }

    let result = null;

    for (let len = 1; len <= 9; ++len) {
        let string = cur_state[0][len];
        if (string == null) {
            continue;
        }

        string += String(len) + plain.substring(plain.length - len, plain.length);
        if (result == null || string.length < result.length) {
            result = string;
        } else if (string.length == result.length && Math.random() < 0.5) {
            result = string;
        }
    }

    for (let offset = 1; offset <= 9; ++offset) {
        for (let len = 1; len <= 9; ++len) {
            let string = cur_state[offset][len];
            if (string == null) {
                continue;
            }

            string += String(len) + "" + String(offset);
            if (result == null || string.length < result.length) {
                result = string;
            } else if (string.length == result.length && Math.random() < 0.5) {
                result = string;
            }
        }
    }

    return result ?? "";
}

export const encryptionICaesarCipher: CCTSolver<CodingContractName.EncryptionICaesarCipher> = function (data) {
    const [text, key] = data;

    function subtractFromLetter(letter: string, n: number) {
        const letterAsNumber = letter.charCodeAt(0) - 'A'.charCodeAt(0);
        // Escape characters that aren't capital letters
        if (letterAsNumber < 0 || letterAsNumber > 25) {
            return letter;
        }
        const sum = (letterAsNumber + (26 - n)) % 26; //I don't know why actual subtraction didn't work but that's fine
        return (String.fromCharCode(sum + 'A'.charCodeAt(0)));
    }

    let output = '';
    for (let i = 0; i < text.length; i++) {
        output += subtractFromLetter(text[i], key);
    }
    return output;

}

export const encryptionIiVigenreCipher: CCTSolver<CodingContractName.EncryptionIIVigenereCipher> = function (data) {
    const [text, keyword] = data;

    function addLetters(letterOne: string, letterTwo: string) {
        const numberOne = letterOne.charCodeAt(0) - 'A'.charCodeAt(0);
        const numberTwo = letterTwo.charCodeAt(0) - 'A'.charCodeAt(0);
        const sum = (numberOne + numberTwo) % 26;
        return (String.fromCharCode(sum + 'A'.charCodeAt(0)));
    }

    let output = '';
    for (let i = 0; i < text.length; i++) {
        output += addLetters(text[i], keyword[i % keyword.length]);
    }
    return output;
}

export const findAllValidMathExpressions: CCTSolver<CodingContractName.FindAllValidMathExpressions> = function (input) {

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

export const findLargestPrimeFactor: CCTSolver<CodingContractName.FindLargestPrimeFactor> = function (n) {
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

export const generateIpAddresses: CCTSolver<CodingContractName.GenerateIPAddresses> = function (input) {
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

export const hammingcodesEncodedBinaryToInteger: CCTSolver<CodingContractName.HammingCodesEncodedBinaryToInteger> = function (hammingCode) {
    // hammingCode = '1001101010';

    function toBinary(n: number) {
        let remaining = n;
        let binary = '';
        while (remaining > 0) {
            binary = `${remaining % 2}${binary}`;
            remaining = Math.floor(remaining / 2);
        }
        return binary;
    }

    // Strictly speaking, this actually converts from a string representing binary to the 'number' type.
    function toDecimal(bits: string) {
        let total = 0;
        for (let i = 0; i < bits.length; i++) {
            total *= 2;
            if (bits[i] == '1') {
                total += 1;
            }
        }
        return total;
    }

    function bitwiseXor(bitsOne: string, bitsTwo: string) {
        let resultBits = '';
        for (let i = 0; i < bitsOne.length; i++) {
            if (bitsOne[i] == bitsTwo[i]) {
                resultBits += '0';
            } else {
                resultBits += '1';
            }
        }
        return resultBits;
    }

    function flipBit(bitstring: string, index: number) {
        let newBitstring = ''
        for (let i = 0; i < bitstring.length; i++) {
            if (i == index) {
                if (bitstring[i] == '0') {
                    newBitstring += '1';
                } else {
                    newBitstring += '0';
                }
            } else {
                newBitstring += bitstring[i];
            }
        }
        return newBitstring;
    }

    function pad(string: string) {
        return string.padStart(hammingCode.length, '0');
    }

    let runningXor = pad('');
    for (let i = 0; i < hammingCode.length; i++) {
        if (hammingCode[i] == '1') {
            runningXor = bitwiseXor(runningXor, pad(toBinary(i)));
        }
    }
    const errorPosition = toDecimal(runningXor);
    const correctedHammingCode = flipBit(hammingCode, errorPosition);

    let strippedBinary = '';
    for (let i = 1; i < correctedHammingCode.length; i++) {
        const isPowerOfTwo: boolean = Math.log2(i) % 1 === 0;
        if (!isPowerOfTwo) {
            strippedBinary += correctedHammingCode[i];
        }
    }
    const final = toDecimal(strippedBinary);
    return final;
}

export const hammingcodesIntegerToEncodedBinary: CCTSolver<CodingContractName.HammingCodesIntegerToEncodedBinary> = function (n) {
    function toBinary(n: number): (0 | 1)[] {
        let remaining = n;
        const binary: (0 | 1)[] = [];
        while (remaining > 0) {
            binary.splice(0, 0, (<0 | 1>(remaining % 2)));
            remaining = Math.floor(remaining / 2);
        }
        return binary;
    }

    function isParityBit(i: number) {
        return i == 0 || (Math.log2(i) % 1 === 0)
    }

    // Make space in the array for the encoding bits.
    const normalBinary = toBinary(n);
    const paddedBinary = normalBinary.slice();
    paddedBinary.splice(0, 0, 0); // Insert the padding at position 0, which can't be done in the loop
    for (let i = 1; i < paddedBinary.length; i *= 2) {
        // Insert a 0 at location i, shifting everything after to a higher index.
        paddedBinary.splice(i, 0, 0);
    }

    // Main parity bits.
    for (let i = 1; i < paddedBinary.length; i *= 2) {
        let parityGroup = 0;
        for (let j = 0; j < paddedBinary.length; j++) {
            // Only take values from the parity group
            if ((j % (i * 2)) >= i) {
                parityGroup = parityGroup + paddedBinary[j];
            }
        }
        // Replace the value at location i with the parity bit.
        paddedBinary[i] = <0 | 1>(parityGroup % 2);
    }

    // Index 0 parity bit.
    let parityGroup = 0;
    for (let i = 1; i < paddedBinary.length; i++) {
        parityGroup = parityGroup + Number(paddedBinary[i]);
    }
    paddedBinary[0] = <0 | 1>(parityGroup % 2);

    // Error checking
    const dataBits = paddedBinary.filter((value, index, array) => !isParityBit(index));
    if (dataBits.join('') != normalBinary.join('')) {
        throw new Error(`Data bits (${dataBits.join('')}) do not match normal binary (${normalBinary.join('')}). Would have submitted ${paddedBinary.join('')}.`);
    }

    // Convert to string and return
    const hammingCode = paddedBinary.join('');
    return hammingCode;
}

export const mergeOverlappingIntervals: CCTSolver<CodingContractName.MergeOverlappingIntervals> = function (input) {

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

export const minimumPathSumInATriangle: CCTSolver<CodingContractName.MinimumPathSumInATriangle> = function (input) {
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

export const proper2coloringOfAGraph: CCTSolver<CodingContractName.Proper2ColoringOfAGraph> = function (data) {

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

export const sanitizeParenthesesInExpression: CCTSolver<CodingContractName.SanitizeParenthesesInExpression> = function (input) {
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

export const shortestPathInAGrid: CCTSolver<CodingContractName.ShortestPathInAGrid> = function (grid) {
    type Tile = [number, number]
    type TilePath = [Tile, string];

    // Because I didn't notice earlier, X is up/down and Y is left/right.
    function exploreTile(grid: (0 | 1)[][], tilePath: TilePath, livePaths: TilePath[]) {
        const [[x, y], path] = tilePath;
        // Explore upwards
        if (x > 0 && (grid[x - 1][y] == 0)) {
            grid[x - 1][y] = 1;
            livePaths.push([[x - 1, y], `${path}U`]);
        }
        // Explore downwards
        if (x < grid.length - 1 && (grid[x + 1][y] == 0)) {
            grid[x + 1][y] = 1;
            livePaths.push([[x + 1, y], `${path}D`]);
        }
        // Explore leftwards
        if (y > 0 && (grid[x][y - 1] == 0)) {
            grid[x][y - 1] = 1;
            livePaths.push([[x, y - 1], `${path}L`]);
        }
        // Explore rightwards
        if (y < grid[x].length - 1 && (grid[x][y + 1] == 0)) {
            grid[x][y + 1] = 1;
            livePaths.push([[x, y + 1], `${path}R`]);
        }
    }

    grid[0][0] = 1;
    const livePaths: TilePath[] = [[[0, 0], '']];

    while (livePaths.length > 0) {
        const tilePath = livePaths.shift();
        const [[x, y], path] = tilePath;

        // Check if this tile is the exit
        if ((x == grid.length - 1) && (y == grid[x].length - 1)) {
            return path;
        }

        exploreTile(grid, tilePath, livePaths);
    }

    // If no path is found, return an empty string.
    return '';
}

export const spiralizeMatrix: CCTSolver<CodingContractName.SpiralizeMatrix> = function (matrix) {
    function internalSpiralizeMatrix(matrix: number[][]) {
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
        return [].concat.apply([], [top, right, bottom, left, internalSpiralizeMatrix(minimatrix)]);
    }
    return internalSpiralizeMatrix(matrix);
}

export const subarrayWithMaximumSum: CCTSolver<CodingContractName.SubarrayWithMaximumSum> = function (input) {
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

export const squareRoot: CCTSolver<CodingContractName.SquareRoot> = function (input) {

    // Note to self: (x >> 1n) is a bit-shift that returns floor(x/2).

    // Input validation. Probably unnecessary for a contract solver, but you never know.
    if (input < 0n) {
        throw new Error("square root of negative numbers is not supported");
    }
    if (input < 2n) {
        return input;
    }

    // Set our initial guess to half the squared number. This should never be too much.
    let x0 = input >> 1n;
    // Newton's Method: x_{n+1} = x_n - (f(x_n) / f'(x_n)) = x_n - ((x^2_n - a) / 2 * x_n) = (x_n + (a / x_n)) / 2
    let x1 = (x0 + input / x0) >> 1n;

    // Repeat until convergence
    while (x1 < x0) {
        x0 = x1;
        x1 = (x0 + input / x0) >> 1n;
    }

    // Ensure the returned value hasn't overshot by 1 due to truncation toward 0 sometimes being floor and sometimes being ceil.
    const r = x0 * x0 > input ? x0 - 1n : x0;

    // Determine if the output should be rounded up by comparing the squared values to the original.
    const lowDiff = input - r * r;
    const highDiff = (r + 1n) * (r + 1n) - input;
    const rounded = lowDiff < highDiff ? r : r + 1n;

    return rounded;
}

// This is actually a *more intensive* case of totalWaysToSumIi, with smaller values of n.
export const totalWaysToSum: CCTSolver<CodingContractName.TotalWaysToSum> = function (n) {
    const allowedValues = [];
    for (let i = 1; i < n; i++) {
        allowedValues.push(i);
    }
    return totalWaysToSumIi([n, allowedValues]);
}

export const totalWaysToSumIi: CCTSolver<CodingContractName.TotalWaysToSumII> = function (data) {
    const [n, allowedValues] = data;

    //Initialize a list of computed ways to sum waysToSum[x] with 0s, excepting the base case of 1.
    const waysToSum = [1];
    for (var i = 1; i <= n; i++) {
        waysToSum[i] = 0;
    }

    //For each value we are allowed to add
    for (const i of allowedValues) {

        // We can obtain a new way of adding to j by taking an existing way to add to j-i and adding i.
        // If done in ascending order, this will give every possible way.
        for (let j = i; j < waysToSum.length; j++) {
            waysToSum[j] += waysToSum[j - i];
        }
    }

    //Return the final value
    return waysToSum[n];
}


export const uniquePathsInAGridI: CCTSolver<CodingContractName.UniquePathsInAGridI> = function (input) {
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

export const uniquePathsInAGridIi: CCTSolver<CodingContractName.UniquePathsInAGridII> = function (input) {
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
