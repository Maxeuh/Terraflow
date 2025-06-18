import {FieldType, TerraNode} from "@/util/types";
import {VirtualMachine} from "@/util/virtual_machine"; // Adjust the import path as necessary
import {ProxmoxProvider} from "@/util/proxmox";

export class Network extends TerraNode {

    public address: string = "0.0.0.0/24";
    public comment: string = "comment";
    public _proxmox: ProxmoxProvider | null = null;
    public _machines: VirtualMachine[] = [];

    constructor(name: string) {
        super(name);
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
        vm._network = this;
    }

    removeMachine(vm: VirtualMachine) {
        this._machines = this._machines.filter(m => m !== vm);
        vm._network = null;
    }

    getMachines(): VirtualMachine[] {
        return this._machines;
    }

    setProxmox(proxmox: ProxmoxProvider | null) {
        this._proxmox = proxmox;

        if (this._proxmox?._networks) {
            this._proxmox._networks = this._proxmox._networks.filter(n => n !== this);
        }

        if (proxmox) {
            this._proxmox?._networks.push(this);
        }
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
