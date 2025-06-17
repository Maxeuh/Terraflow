import {FieldType, TerraNode} from "@/util/types";
import {VirtualMachine} from "@/util/virtual_machine"; // Adjust the import path as necessary
import * as fs from "fs";
import {ProxmoxProvider} from "@/util/proxmox";

export class Network extends TerraNode {

    public name: string = "";
    public img_network: string = "";
    public address: string = "0.0.0.0/24";
    public comment: string = "comment";
    public name_resource_network: string = "";
    public proxmox: ProxmoxProvider | null = null;
    private machines: VirtualMachine[] = [];

    constructor() {
        super();
        this._varTypes = [
            {
                name: "address",
                type: FieldType.String,
                regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\/([0-9]|[12]\d|3[0-2])$/,
                value: this.address
            }
        ]
    }


    addMachine(vm: VirtualMachine) {
        this.machines.push(vm);
        vm.setNetwork(this);
    }

    removeMachine(vm: VirtualMachine) {
        this.machines = this.machines.filter(m => m !== vm);
        vm.setNetwork(null);
    }

    getMachines(): VirtualMachine[] {
        return this.machines;
    }

    setProxmox(proxmox: ProxmoxProvider | null) {
        this.proxmox = proxmox;
    }

    generateConfigFileContent(): string {
        return `resource "${this.name_resource_network}" "${this.name}" {
  depends_on = [
    ${this.img_network}
  ]

  node_name = "${this.proxmox?.node_name}"
  name      = "${this.name}"

  address = "${this.address}"

  comment = "${this.comment}"

}`

    }

    writeConfigFile(fileName: string) {
        const content = this.generateConfigFileContent();
        fs.writeFileSync(fileName, content);
    }


}
