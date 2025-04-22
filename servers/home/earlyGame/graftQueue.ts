import { AutocompleteData } from "@/NetscriptDefinitions";

/** @param {NS} ns */
export async function main(ns: NS) {
    let augs = <string[]>ns.args;
    const allGraftable = ns.grafting.getGraftableAugmentations();
    augs = augs.filter((value, index, array) => allGraftable.includes(value));

    while (augs.length > 0) {
        ns.print(augs);
        // Graft the first possible aug in the list
        for (let i = 0; i < augs.length; i++) {
            const returned = await safeGraft(ns, augs[i]);
            if (returned) {
                augs.splice(i, 1);
                break;
            }
        }
        await ns.sleep(10000);
    }
}

async function safeGraft(ns: NS, augName: string) {
    await ns.grafting.waitForOngoingGrafting();
    ns.singularity.travelToCity("New Tokyo");
    return ns.grafting.graftAugmentation(augName, false);
}


export function autocomplete(data: AutocompleteData) {
    return [...augmentationList.map((value, index, array) => `\"${value}\"`), '--tail'];
}

// TODO: Definitely incomplete
const augmentationList: string[] = ["Augmented Targeting I", "Augmented Targeting II", "Augmented Targeting III", "Synthetic Heart", "Synfibril Muscle", "Combat Rib I", "Combat Rib II", "Combat Rib III", "Nanofiber Weave", "NEMEAN Subdermal Weave", "Wired Reflexes", "Graphene Bone Lacings", "Bionic Spine", "Graphene Bionic Spine Upgrade", "Bionic Legs", "Graphene Bionic Legs Upgrade", "Speech Processor Implant", "TITN-41 Gene-Modification Injection", "Enhanced Social Interaction Implant", "Artificial Bio-neural Network Implant", "Artificial Synaptic Potentiation", "Enhanced Myelin Sheathing", "Neural-Retention Enhancement", "DataJack", "Embedded Netburner Module", "Embedded Netburner Module Core Implant", "Embedded Netburner Module Core V2 Upgrade", "Embedded Netburner Module Core V3 Upgrade", "Embedded Netburner Module Analyze Engine", "Embedded Netburner Module Direct Memory Access Upgrade", "Neuralstimulator", "Neural Accelerator", "Cranial Signal Processors - Gen III", "Cranial Signal Processors - Gen IV", "Cranial Signal Processors - Gen V", "Neuronal Densification", "Nuoptimal Nootropic Injector Implant", "Speech Enhancement", "FocusWire", "PC Direct-Neural Interface", "PC Direct-Neural Interface Optimization Submodule", "PC Direct-Neural Interface NeuroNet Injector", "PCMatrix", "ADR-V2 Pheromone Gene", "The Shadow's Simulacrum", "Hacknet Node CPU Architecture Neural-Upload", "Hacknet Node Cache Architecture Neural-Upload", "Hacknet Node NIC Architecture Neural-Upload", "Hacknet Node Kernel Direct-Neural Interface", "Hacknet Node Core Direct-Neural Interface", "Neurotrainer II", "Neurotrainer III", "HyperSight Corneal Implant", "LuminCloaking-V1 Skin Implant", "LuminCloaking-V2 Skin Implant", "HemoRecirculator", "SmartSonar Implant", "QLink", "SPTN-97 Gene Modification", "ECorp HVMind Implant", "CordiARC Fusion Reactor", "SmartJaw", "Neotra", "nextSENS Gene Modification", "OmniTek InfoLoad", "Photosynthetic Cells", "The Black Hand", "Unstable Circadian Modulator", "CRTX42-AA Gene Modification", "NutriGen Implant", "INFRARET Enhancement", "DermaForce Particle Barrier", "Graphene BrachiBlades Upgrade", "Graphene Bionic Arms Upgrade", "BrachiBlades", "Bionic Arms", "Hydroflame Left Arm"];