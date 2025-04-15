/** @param {NS} ns */
export async function main(ns: NS) {
    const scripts = ns.ls('home', '.js');
    for(const script of scripts){
        ns.rm(script, 'home');
    }
}