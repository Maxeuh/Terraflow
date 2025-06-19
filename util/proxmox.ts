import { Network } from "@/util/network";
import { FieldType, TerraNode } from "@/util/types";

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
        super("Proxmox");
        this._varTypes = [
            {
                name: "name",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9-]+$/,
                value: this.name,
                mandatory: true,
                label: "Name"
            },
            {
                name: "host",
                type: FieldType.String,
                regex: /^([a-zA-Z0-9.-]+)$/,
                value: this.host,
                mandatory: true,
                label: "Host (IP or FQDN)"
            },
            {
                name: "apiToken",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]+$/,
                value: this.apiToken,
                mandatory: false,
                label: "API Token"
            },
            {
                name: "username",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]+@(pam|pve)$/,
                value: this.username,
                mandatory: true,
                label: "Username"
            },
            {
                name: "password",
                type: FieldType.Password,
                regex: /.*/,
                value: this.password,
                mandatory: true,
                label: "Password"
            }, {
                name: "insecure",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.insecure,
                mandatory: false,
                label: "Insecure (disable SSL verification if using self-signed certificates)"
            }, {
                name: "port",
                type: FieldType.Integer,
                regex: /.*/,
                value: this.port,
                mandatory: true,
                label: "HTTP(s) port"
            }, {
                name: "sshPort",
                type: FieldType.Integer,
                regex: /^[0-9]+$/,
                value: this.sshPort,
                mandatory: true,
                label: "SSH port"
            }, {
                name: "node_name",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9-]+$/,
                value: this.node_name,
                mandatory: true,
                label: "Node name"
            }, {
                name: "agent",
                type: FieldType.CheckBox,
                regex: /^[a-zA-Z0-9-]+$/,
                value: this.agent,
                mandatory: false,
                label: "Agent"
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