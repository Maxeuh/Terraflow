import {FieldType, TerraNode} from "@/util/types";
import {VirtualMachineTemplate} from "@/util/virtual_machine_template";
import {Network} from "@/util/network";


export class VirtualMachine extends TerraNode {

    public username: string = "root";
    public keys: string = "";
    public address: string = "0.0.0.0/24";
    public gateway: string = "0.0.0.0/24";
    public image_name: string = "";
    public _hardware: VirtualMachineTemplate | undefined = undefined;
    public _network: Network | null = null;
    public name_resource: string = `test`;

    constructor(name: string) {
        super(name);
        this._varTypes = [
            {
                name: "address",
                type: FieldType.String,
                regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\/([0-9]|[12]\d|3[0-2])$/,
                value: this.address,
                mandatory: true,
            }, {
                name: "gateway",
                type: FieldType.String,
                regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\/([0-9]|[12]\d|3[0-2])$/,
                value: this.gateway,
                mandatory: true,
            }
        ]
    }

    setNetwork(network: Network | null) {
        this._network = network;

        if (this._network?._machines) {
            this._network._machines = this._network._machines.filter(n => n !== this);
        }

        if (network) {
            this._network?._machines.push(this);
        }
    }

    generateConfigNode(): string {
        return `resource "proxmox_virtual_environment_vm" "${this.name_resource}" {
  provider = ${this._network?._proxmox?.getProviderName()}
  name      = "${this.name}"
  node_name = "${this._hardware?.getProxmox()?.node_name}"

  clone {
    vm_id = proxmox_virtual_environment_vm.${this._hardware?.getResourceName()}.id
  }
  
  initialization {
    ip_config {
      ipv4 {
        address = "${this.address}"
        gateway = "${this.gateway}"
      }
    }

    user_account {
      username = "${this.username}"
      keys     = ${this.keys}
    }
  }

  network_device {
    bridge = "${this._network?.name}"
  }
}
    `;

    }

}
