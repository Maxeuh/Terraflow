import { Network } from "@/util/network";
import { FieldType, TerraNode } from "@/util/types";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";


export class VirtualMachine extends TerraNode {

    public username: string = "user";
    public password: string = "azerty";
    public keys: string = "";
    public address: string = "0.0.0.0/24";
    public gateway: string = "0.0.0.0";
    public _hardware: VirtualMachineTemplate | undefined = undefined;
    public _network: Network | null = null;
    
    // Propriété name_resource calculée dynamiquement
    get name_resource(): string {
        // Utiliser le nom du modèle s'il existe, sinon utiliser "test"
        return this._hardware ? this._hardware.name + this.name : "test";
    }

    constructor(template: VirtualMachineTemplate) {
        super("Virtual Machine");
        this._hardware = template;
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
                name: "password",
                type: FieldType.Password,
                regex: /^[a-zA-Z0-9-]+$/,
                value: this.name,
                mandatory: true,
                label: "Password",
            },
            {
                name: "address",
                type: FieldType.String,
                regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\/([0-9]|[12]\d|3[0-2])$/,
                value: this.address,
                mandatory: true,
                label: "IP Address"
            }, {
                name: "gateway",
                type: FieldType.String,
                // Regex pour valider l'adresse ip sans le masque de sous-réseau
                regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
                value: this.gateway,
                mandatory: true,
                label: "Gateway"
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
        // S'assurer que nous utilisons le nom le plus récent du modèle
        const vmName = this.name_resource;
        
        return `resource "proxmox_virtual_environment_vm" "${vmName + "-" + this.getUUID()}" {
  provider = ${this._network?._proxmox?.getProviderName()}
  name      = "${this.name}"
  node_name = "${this._network?._proxmox?.node_name}"
  started  = true
  stop_on_destroy = false
  depends_on = [
    proxmox_virtual_environment_vm.${this._hardware?.getNodeID() + "-" + this._network?._proxmox?.getUUID()}
  ]
  clone {
    vm_id = proxmox_virtual_environment_vm.${this._hardware?.getNodeID() + "-" + this._network?._proxmox?.getUUID()}.id
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
      # keys     = ${this.keys}
      password = "${this.password}"
    }
  }

  network_device {
    bridge = "${this._network?.name}"
  }
}
    `;

    }

}
