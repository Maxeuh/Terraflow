import { Configuration } from "@/util/configuration";
import { Network } from "@/util/network";
import { ProxmoxProvider } from "@/util/proxmox";
import { VirtualMachine } from "@/util/virtual_machine";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";

/**
 * Type définissant la structure d'export/import
 */
export type TerraflowExport = {
    version: string;
    date: string;
    configuration: ConfigurationExport;
    providers: ProxmoxProviderExport[];
    templates: VirtualMachineTemplateExport[];
    networks: NetworkExport[];
    virtualMachines: VirtualMachineExport[];
    connections: ConnectionExport[];
};

type ConfigurationExport = {
    id: string;
};

type ProxmoxProviderExport = {
    id: string;
    name: string;
    node_name: string;
    host: string;
    apiToken: string;
    port: number;
    insecure: boolean;
    username: string;
    password: string;
    agent: boolean;
    sshPort: number;
};

type VirtualMachineTemplateExport = {
    id: string;
    name: string;
    description: string;
    stopOnDestroy: boolean;
    cpuCores: number;
    memory: number;
    diskInterface: string;
    diskSize: number;
    sourceURL: string;
    imageFileName: string;
    configurationId: string;
};

type NetworkExport = {
    id: string;
    name: string;
    address: string;
    comment: string;
    proxmoxId: string | null;
};

type VirtualMachineExport = {
    id: string;
    name: string;
    username: string;
    keys: string;
    address: string;
    gateway: string;
    templateId: string;
    networkId: string | null;
};

type ConnectionExport = {
    source: string;
    target: string;
    sourceType: string;
    targetType: string;
};

/**
 * Exporte la configuration actuelle en objet JSON
 */
export const exportConfiguration = (config: Configuration): TerraflowExport => {
    const providers: ProxmoxProviderExport[] = [];
    const templates: VirtualMachineTemplateExport[] = [];
    const networks: NetworkExport[] = [];
    const virtualMachines: VirtualMachineExport[] = [];
    const connections: ConnectionExport[] = [];

    // Exporter les Proxmox providers
    for (const provider of config.providers) {
        providers.push({
            id: provider.getUUID(),
            name: provider.name,
            node_name: provider.node_name,
            host: (provider as any).host,
            apiToken: (provider as any).apiToken,
            port: (provider as any).port,
            insecure: (provider as any).insecure,
            username: (provider as any).username,
            password: (provider as any).password,
            agent: (provider as any).agent,
            sshPort: (provider as any).sshPort
        });

        // Exporter les réseaux associés à ce provider
        for (const network of provider._networks) {
            networks.push({
                id: network.getUUID(),
                name: network.name,
                address: network.address,
                comment: network.comment,
                proxmoxId: provider.getUUID()
            });

            // Ajouter la connexion provider -> network
            connections.push({
                source: provider.getUUID(),
                target: network.getUUID(),
                sourceType: "Proxmox",
                targetType: "Network"
            });

            // Exporter les machines virtuelles associées à ce réseau
            for (const vm of network._machines) {
                // Vérifier si la VM a un template associé
                if (vm._hardware) {
                    virtualMachines.push({
                        id: vm.getUUID(),
                        name: vm.name,
                        username: vm.username,
                        keys: vm.keys,
                        address: vm.address,
                        gateway: vm.gateway,
                        templateId: vm._hardware.getUUID(),
                        networkId: network.getUUID()
                    });

                    // Ajouter la connexion network -> vm
                    connections.push({
                        source: network.getUUID(),
                        target: vm.getUUID(),
                        sourceType: "Network",
                        targetType: "Virtual Machine"
                    });
                }
            }
        }
    }

    // Exporter les templates de VM
    for (const template of config.templates) {
        templates.push({
            id: template.getUUID(),
            name: template.name,
            description: template.description,
            stopOnDestroy: template.stopOnDestroy,
            cpuCores: template.cpuCores,
            memory: template.memory,
            diskInterface: template.diskInterface,
            diskSize: template.diskSize,
            sourceURL: template.sourceURL,
            imageFileName: template.imageFileName,
            configurationId: config.getUUID()
        });
    }

    return {
        version: "1.0",
        date: new Date().toISOString(),
        configuration: {
            id: config.getUUID()
        },
        providers,
        templates,
        networks,
        virtualMachines,
        connections
    };
};

/**
 * Importe une configuration à partir d'un objet JSON
 */
export const importConfiguration = (data: TerraflowExport): Configuration => {
    const config = new Configuration();
    const providerMap = new Map<string, ProxmoxProvider>();
    const templateMap = new Map<string, VirtualMachineTemplate>();
    const networkMap = new Map<string, Network>();
    const vmMap = new Map<string, VirtualMachine>();

    // Importer les templates
    for (const templateData of data.templates) {
        const template = new VirtualMachineTemplate(config);
        template.name = templateData.name;
        template.description = templateData.description;
        template.stopOnDestroy = templateData.stopOnDestroy;
        template.cpuCores = templateData.cpuCores;
        template.memory = templateData.memory;
        template.diskInterface = templateData.diskInterface;
        template.diskSize = templateData.diskSize;
        template.sourceURL = templateData.sourceURL;
        template.imageFileName = templateData.imageFileName;
        
        config.addTemplate(template);
        
        // On stocke le template dans la map avec son ID pour les références
        templateMap.set(templateData.id, template);
    }

    // Importer les providers
    for (const providerData of data.providers) {
        const provider = new ProxmoxProvider();
        provider.name = providerData.name;
        provider.node_name = providerData.node_name;
        (provider as any).host = providerData.host;
        (provider as any).apiToken = providerData.apiToken;
        (provider as any).port = providerData.port;
        (provider as any).insecure = providerData.insecure;
        (provider as any).username = providerData.username;
        (provider as any).password = providerData.password;
        (provider as any).agent = providerData.agent;
        (provider as any).sshPort = providerData.sshPort;
        
        config.addProvider(provider);
        
        // On stocke le provider dans la map avec son ID pour les références
        providerMap.set(providerData.id, provider);
    }

    // Importer les réseaux
    for (const networkData of data.networks) {
        const network = new Network();
        network.name = networkData.name;
        network.address = networkData.address;
        network.comment = networkData.comment;
        
        // Associer au provider si existant
        if (networkData.proxmoxId && providerMap.has(networkData.proxmoxId)) {
            const provider = providerMap.get(networkData.proxmoxId)!;
            network.setProxmox(provider);
        }
        
        // On stocke le réseau dans la map avec son ID pour les références
        networkMap.set(networkData.id, network);
    }

    // Importer les machines virtuelles
    for (const vmData of data.virtualMachines) {
        // Vérifier que le template existe
        if (templateMap.has(vmData.templateId)) {
            const template = templateMap.get(vmData.templateId)!;
            const vm = new VirtualMachine(template);
            
            vm.name = vmData.name;
            vm.username = vmData.username;
            vm.keys = vmData.keys;
            vm.address = vmData.address;
            vm.gateway = vmData.gateway;
            
            // Associer au réseau si existant
            if (vmData.networkId && networkMap.has(vmData.networkId)) {
                const network = networkMap.get(vmData.networkId)!;
                vm.setNetwork(network);
            }
            
            // On stocke la VM dans la map avec son ID pour les références
            vmMap.set(vmData.id, vm);
        }
    }

    return config;
};

/**
 * Exporte la configuration dans un fichier JSON
 */
export const exportToFile = (config: Configuration): void => {
    const exportData = exportConfiguration(config);
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Créer un blob pour le téléchargement
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = `terraflow-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Nettoyer
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Importe une configuration à partir d'un fichier JSON
 * @param jsonData Le contenu JSON à importer
 * @returns La configuration importée
 */
export const importFromJson = (jsonData: string): Configuration => {
    try {
        const importData = JSON.parse(jsonData) as TerraflowExport;
        return importConfiguration(importData);
    } catch (error) {
        console.error("Erreur lors de l'importation:", error);
        throw new Error("Le fichier importé n'est pas valide");
    }
};
