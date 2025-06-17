import {FieldType, TerraNode} from "@/util/types";
import {VirtualMachine} from "@/util/virtual_machine"; // Adjust the import path as necessary
import {ProxmoxProvider} from "@/util/proxmox";

export class Network extends TerraNode {

    public name: string = "";
    public address: string = "0.0.0.0/24";
    public comment: string = "comment";
    public _proxmox: ProxmoxProvider | null = null;
    private _machines: VirtualMachine[] = [];

    constructor() {
        super();
        this._varTypes = [
            {
                name: "address",
                type: FieldType.String,
                regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\/([0-9]|[12]\d|3[0-2])$/,
                value: this.address,
                mandatory: true
            }
        ]
    }


    addMachine(vm: VirtualMachine) {
        this._machines.push(vm);
        vm.setNetwork(this);
    }

    removeMachine(vm: VirtualMachine) {
        this._machines = this._machines.filter(m => m !== vm);
        vm.setNetwork(null);
    }

    getMachines(): VirtualMachine[] {
        return this._machines;
    }

    setProxmox(proxmox: ProxmoxProvider | null) {
        this._proxmox = proxmox;
    }

    generateConfigNode(): string {
        return `resource "proxmox_virtual_environment_network_linux_bridge" "${this.name}" {
  node_name = "${this._proxmox?.node_name}"
  name      = "${this.name}"
  address = "${this.address}"
  comment = "${this.comment}"
}`

    }

    getChildren(): TerraNode[] {
        return this._machines;
    }
}
