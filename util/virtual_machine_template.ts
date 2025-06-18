import {FieldType, TerraNode} from "@/util/types";
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
    public contentType : string = "iso"
    public sourceName : string = "default_cloud_image"
    public sourceURL : string = "default_source.com";
    public imageFileName : string = "default_source "

    private _proxmox : ProxmoxProvider | null = null;

    constructor(name: string) {
        super(name);
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

    setProxmox(proxmox : ProxmoxProvider) {
        this._proxmox = proxmox;
    }

    getProxmox() : ProxmoxProvider | null {
        if (this._proxmox != null) {
            return this._proxmox;
        }
        else {
            return null;
        }
    }

    getResourceName(): string {
        return this.name;
    }

    generateConfigNode(): string {
        return `"proxmox_virtual_environment_vm" "${this.getResourceName()}" {
    name = "${this.name}"
    description = "${this.description}"
 
    node_name = "${this._proxmox?.node_name}"

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
        file_id = proxmox_virtual_environment_download_file.${this.sourceName}.id
        interface = "${this.diskInterface}"
        size = ${this.diskSize}
    }
}

resource "proxmox_virtual_environment_download_file" "${this.sourceName}" {
    content_type = "iso"
    datastore_id = "local-lvm"
    node_name = "${this._proxmox?.node_name}"
    url = "${this.sourceURL}"
    file_name = "${this.imageFileName}" 
}
`
    }   

}
