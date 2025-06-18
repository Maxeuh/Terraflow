import {FieldType, TerraNode} from "@/util/types";
import {Network} from "@/util/network";

/**
 * ProxmoxProvider class represents a Proxmox provider.
 */
export class ProxmoxProvider extends TerraNode {
    public node_name: string = "";

    private host: string = "";
    private apiToken: string = "";
    private port: number = 8006;
    private insecure: boolean = true;
    private username: string = "root@pam";
    private password: string = "";
    public _networks: Network[] = [];

    private agent: boolean = false;
    private sshPort: number = 22;

    constructor() {
        super();
        this._varTypes = [
            {
                name: "username",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]+@(pam|pve)$/,
                value: this.insecure,
                mandatory: true

            },
            {
                name: "password",
                type: FieldType.Password,
                regex: /.*/,
                value: this.password,
                mandatory: true
            }, {
                name: "insecure",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.insecure,
                mandatory: false
            }, {
                name: "port",
                type: FieldType.Integer,
                regex: /.*/,
                value: this.port,
                mandatory: true
            }, {
                name: "sshPort",
                type: FieldType.Integer,
                regex: /.*/,
                value: this.sshPort,
                mandatory: true
            }
        ]
    }

    getNodeID(): string {
        return super.getUUID() + "-" + this.toKebabCase(this.host);
    }

    addNetwork(network: Network): void {
        this._networks.push(network);
        network._proxmox = this;
    }

    removeNetwork(network: Network): void {
        this._networks = this._networks.filter(n => n !== network);
        network._proxmox = null;
    }

    generateConfigNode(): string {
        return `
provider "proxmox" {
  alias = "${this.getNodeID()}"
  endpoint = "https://${this.host}:${this.port.toString()}/"
  api_token = "${this.apiToken}"
  username = "${this.username}"
  password = "${this.password}"
  insecure = ${this.insecure}
  
  ssh {
    agent = ${this.agent}
    
    node {
        name = "${this.node_name}"
        address = "${this.host}"
        port = ${this.sshPort.toString()}
    }
  }
  
}
        `;
    }

    getProviderName(): string {
        return `proxmox.${this.getNodeID()}`;
    }

    getChildren(): TerraNode[] {
        return this._networks;
    }
}