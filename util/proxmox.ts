import {FieldType, TerraNode} from "@/util/types";
import {Network} from "@/util/network";

/**
 * ProxmoxProvider class represents a Proxmox provider.
 */
export class ProxmoxProvider extends TerraNode {
    public nodeName: string = "";
    
    private host: string = "";
    private port: number = 8006;
    private insecure: boolean = true;
    private username: string = "root@pam";
    private password: string = "";
    private _networks: Network[] = [];

    constructor() {
        super();
        this._varTypes = [
            {
                name: "username",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]+@(pam|pve)$/,
                value: this.insecure
            },
            {
                name: "password",
                type: FieldType.Password,
                regex: /.*/,
                value: this.password
            }, {
                name: "insecure",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.insecure
            }, {
                name: "port",
                type: FieldType.Integer,
                regex: /.*/,
                value: this.port
            }
        ]
    }

    addNetwork(network: Network): void {
        this._networks.push(network);
        network.setProxmox(this);
    }

    removeNetwork(network: Network): void {
        this._networks = this._networks.filter(n => n !== network);
        network.setProxmox(null);
    }

    generateConfigFileContent(): string {
        return `
provider "proxmox" {
  endpoint = "https://${this.host}:${this.port.toString()}/"

  username = "${this.username}"
  password = "${this.password}"
  insecure = ${this.insecure}
}
        `;
    }
}