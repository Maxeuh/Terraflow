import {FieldType, TerraNode} from "@/util/types";
import { ProxmoxProvider } from "./proxmox";
import {Configuration} from "@/util/configuration";


export class VirtualMachineTemplate extends TerraNode {
    public description: string = "";

    // VM configuration
    public stopOnDestroy : boolean = true;

    public cpuCores : number = 1;
    public memory: number = 1024;

    public diskInterface : string = "virtio0";
    public diskSize : number = 20;
    

    // Image configuration
    public sourceURL : string = "default_source.com";
    public imageFileName : string = "default_source "

    public _configuration : Configuration | null = null;

    constructor(configuration: Configuration) {
        super();
        this.setConfiguration(configuration);
        this._varTypes = [
            {
                name: "name",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]$/,
                value: this.name,
                mandatory : true
            }
        ]
    }

    setConfiguration(configuration: Configuration) {
        this._configuration = configuration;

        this._configuration.templates.push(this);
    }


    getResourceName(): string {
        return this.name;
    }


    generateConfigNode(): string {
        let content: string = "";

        // Parcourir this._proxmox.
        this._configuration?.providers.forEach((proxmox: ProxmoxProvider) => {
            content += `
resource "proxmox_virtual_environment_vm" "${this.getNodeID()}" {
    provider = ${proxmox.getProviderName()}
    
    name = "${this.name}"
    description = "${this.description}"
 
    node_name = "${proxmox.node_name}"

    stop_on_destroy = ${this.stopOnDestroy}
    
    cpu {
        cores = ${this.cpuCores}
        type = "host"
    }
    
    memory {
      dedicated = ${this.memory}
      floating = ${this.memory}
    }

    disk {
        datastore_id = "local-lvm"
        file_id = proxmox_virtual_environment_download_file.${"proxmox" + proxmox.getUUID() + "-" + super.getUUID()}.id
        interface = "${this.diskInterface}"
        size = ${this.diskSize}
    }
    
    initialization {
    
    }
}

resource "proxmox_virtual_environment_download_file" "${"proxmox" + proxmox.getUUID() + "-" + super.getUUID()}" {
    provider = ${proxmox.getProviderName()}
    content_type = "iso"
    datastore_id = "local"
    node_name = "${proxmox.node_name}"
    url = "${this.sourceURL}"
    file_name = "${this.imageFileName}" 
}
`;

        });
        return content;
    }   

}
