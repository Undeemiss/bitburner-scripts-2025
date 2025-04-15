import { getHosts } from "../utils/getHosts";
import * as solvers from "./contractSolverHelpers";
type SolverContract = {
    host: string,
    name: string,
    type: string,
    worker?: Worker,
    solution?: any,
    error?: string,
}

export async function main(ns: NS) {
    ns.disableLog("ALL");
    ns.ui.openTail();

    const hosts = getHosts(ns);

    const contracts: SolverContract[] = [];
    const rewards = [];

    //Start a worker for each contract
    for (const hostname of hosts) {
        const contractsHere = ns.ls(hostname, ".cct");
        for (const contractName of contractsHere) {

            //Start a web worker to solve the contract
            const contract = {
                host: hostname,
                name: contractName,
                type: ns.codingcontract.getContractType(contractName, hostname),
            };
            try {
                await startWorker(ns, contract);
                ns.print(`${contract.name}@${contract.host} - Starting`);
                contracts.push(contract);
            }
            catch (e) {
                ns.print(`${contract.name}@${contract.host} - ${e}`);
            }
        }
    }

    //Wait for contracts to be solved
    while (true) {
        for (let i = contracts.length - 1; i >= 0; i--) {
            const contract = contracts[i];
            //If an error is thrown, log it
            if (contract?.error) {
                ns.print(`Error "${contract.error}" thrown by ${contract.name}@${contract.host}, continuing`);
                contracts.splice(i, 1);
            }
            //If a solution is found, submit it
            if (contract?.solution) {
                const reward = ns.codingcontract.attempt(
                    contract.solution, contract.name, contract.host
                );
                if (reward == "") {
                    throw `"${contract.solution}" is wrong answer for ${contract.name}@${contract.host}`;
                }
                //Save the reward and delete the now-unnecessary contract object
                rewards.push(reward);
                contracts.splice(i, 1);
            }
        }

        if (contracts?.length) {
            ns.print(`Pending contracts: ${contracts.map((c) => `${c.name}@${c.host}-${c.type}`).join(", ")}`);
            await ns.sleep(1000);
        } else {
            break;
        }
    }

    ns.print(`Done. Rewards: ${rewards.join(", ")}`);
}

//Uses a regex to convert a string to camelCase
function toCamelCase(string: string) {
    const regex = /\s+(\w)?/gi;
    let camelCased = string.toLowerCase().replace(regex, function (match, letter) {
        return letter.toUpperCase();
    });
    camelCased = camelCased.replace(/[^a-z0-9]/gi, '');
    return camelCased;
}

//Create a blob url for a given piece of code
function blobify(code) {
    const codeBlob = new Blob([code], { type: "text/javascript" });
    const codeBlobURL = URL.createObjectURL(codeBlob);
    return codeBlobURL;
}

async function startWorker(ns: NS, contract: SolverContract) {
    //Get the contract type
    const type = toCamelCase(await ns.codingcontract.getContractType(contract.name, contract.host));
    contract.type = type;

    //Create the url blob
    const solver = solvers[type];
    if (solver === undefined) throw `No solver ${type} found`;
    const code =
        `onmessage = function(msg) {\n` +
        `	console.log("Message received by worker of type ${type}")\n` +
        `	const soln = ${type}(msg.data);\n` +
        `	postMessage(soln);\n` +
        `}\n` +
        `${solver}`;
    const url = blobify(code);

    //Create the worker
    const worker = new Worker(url);
    contract.worker = worker;
    worker.onmessage = function (msg) {
        contract.solution = msg.data; // Removed a JSON.stringify() without knowing what it was doing, because it was putting quotes around my output string
    }
    worker.onerror = function (msg) {
        contract.error = msg.message;
    }

    //Start the worker
    const input = ns.codingcontract.getData(contract.name, contract.host);
    worker.postMessage(input);
}