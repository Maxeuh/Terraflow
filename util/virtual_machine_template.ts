import { Configuration } from "@/util/configuration";
import { FieldType, TerraNode } from "@/util/types";
import { ProxmoxProvider } from "./proxmox";


export class VirtualMachineTemplate extends TerraNode {
    public description: string = "";

    // VM configuration
    public stopOnDestroy : boolean = true;

    public cpuCores : number = 1;
    public memory: number = 1024;

    public diskInterface : string = "virtio0";
    public diskSize : number = 20;
    

    // Image configuration
    public sourceURL : string = "";
    public imageFileName : string = " "

    public _configuration : Configuration | null = null;

    constructor(configuration: Configuration) {
        super("Virtual Machine Template");
        this.setConfiguration(configuration);
        this._varTypes = [
            {
                name: "name",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9.-]+$/,
                value: this.name,
                mandatory : true,
                label: "Name"
            },
            {
                name: "description",
                type: FieldType.String,
                regex: /^.{0,100}$/,
                value: this.description,
                mandatory: false,
                label: "Description"
            },
            {
                name: "stopOnDestroy",
                type: FieldType.CheckBox,
                regex: /^(true|false)$/,
                value: this.stopOnDestroy,
                mandatory: true,
                label: "Stop on destroy"
            },
            {
                name: "cpuCores",
                type: FieldType.Integer,
                regex: /^[1-9][0-9]*$/,
                value: this.cpuCores,
                mandatory: true,
                label: "CPU Cores"
            },
            {
                name: "memory",
                type: FieldType.Integer,
                regex: /^[1-9][0-9]*$/,
                value: this.memory,
                mandatory: true,
                label: "Memory (MB)"
            },
            {
                name: "diskInterface",
                type: FieldType.String,
                regex: /^(virtio0|scsi0|ide0|sata0)$/,
                value: this.diskInterface,
                mandatory : true,
                label : "Disk Interface (virtio0, scsi0, ide0, sata0)"
            },
            {
                name: "diskSize",
                type: FieldType.Integer,
                regex: /^[1-9][0-9]*$/,
                value: this.diskSize,
                mandatory : true,
                label : "Disk Size (GB)"
            },
            {
                name: "sourceURL",
                type: FieldType.String,
                regex : /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                value : this.sourceURL,
                mandatory : true,
                label : "Source URL"
            },
            {
                name : "imageFileName",
                type : FieldType.String,
                regex : /^[a-zA-Z0-9._-]+$/,
                value : this.imageFileName,
                mandatory : true,
                label : "Image File Name"
            }
        ]
    }

    setConfiguration(configuration: Configuration) {
        if (this._configuration) {
            this._configuration.removeTemplate(this);
        }
        this._configuration = configuration;
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
