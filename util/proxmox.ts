import {FieldType, TerraNode} from "@/util/types";

class ProxmoxProvider extends TerraNode {
    /**
     * Represent a Proxmox provider
     */

    private host: string = "";
    private port: number = 8006;
    private insecure: boolean = true;
    private username: string = "root@pam";
    private password: string = "";
    private nodeName: string = "";

    constructor() {
        super();
        this._varTypes = [
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
            }
        ]
    }

    generateConfigFileContent(): string {
        return `
provider "proxmox" {
  endpoint = "https://${this.host}:${this.port.toString()}/"

  username = "${this.username}@pam"
  password = "${this.password}"
  insecure = ${this.insecure}
}
        `;
    }
}