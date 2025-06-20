import { Configuration } from "@/util/configuration";

/**
 * Cette fonction crée les nodes et les edges pour React Flow à partir d'une configuration
 */
export const createNodesAndEdges = (config: Configuration): { nodes: any[], edges: any[] } => {
    const nodes: any[] = [];
    const edges: any[] = [];
    const nodeMap = new Map<string, string>(); // Map pour stocker l'UUID du node -> ID React Flow
    
    // Ajouter les providers
    for (const provider of config.providers) {
        const node: any = {
            id: provider.getNodeID(),
            type: provider.getNodeType(),
            position: { x: 100, y: 100 + nodes.length * 100 }, // Position arbitraire, vous pouvez ajuster
            data: { 
                label: provider.name,
                object: provider 
            }
        };
        nodes.push(node);
        nodeMap.set(provider.getUUID(), node.id);
    }
    
    // Ajouter les réseaux et créer les connections provider -> réseau
    for (const provider of config.providers) {
        for (const network of provider._networks) {
            const node: any = {
                id: network.getNodeID(),
                type: network.getNodeType(),
                position: { x: 300, y: 100 + nodes.length * 100 }, // Position arbitraire à droite des providers
                data: { 
                    label: network.name,
                    object: network 
                }
            };
            nodes.push(node);
            nodeMap.set(network.getUUID(), node.id);
            
            // Créer une connexion provider -> réseau
            if (nodeMap.has(provider.getUUID())) {
                edges.push({
                    id: `e-${provider.getUUID()}-${network.getUUID()}`,
                    source: nodeMap.get(provider.getUUID())!,
                    target: node.id,
                    type: 'default'
                });
            }
            
            // Ajouter les VMs et créer les connexions réseau -> VM
            for (const vm of network._machines) {
                const vmNode: any = {
                    id: vm.getNodeID(),
                    type: vm.getNodeType(),
                    position: { x: 500, y: 100 + nodes.length * 100 }, // Position arbitraire à droite des réseaux
                    data: { 
                        label: vm.name,
                        object: vm 
                    }
                };
                nodes.push(vmNode);
                nodeMap.set(vm.getUUID(), vmNode.id);
                
                // Créer une connexion réseau -> VM
                edges.push({
                    id: `e-${network.getUUID()}-${vm.getUUID()}`,
                    source: node.id,
                    target: vmNode.id,
                    type: 'default'
                });
            }
        }
    }
    
    return { nodes, edges };
};
