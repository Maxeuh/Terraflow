import {FieldType, TerraNode} from "@/util/types";
import {VirtualMachineTemplate} from "@/util/virtual_machine_template";
import * as fs from "fs";
import {Network} from "@/util/network";


export class VirtualMachine extends TerraNode {

    public name: string = "";
    public username: string = "root";
    public keys: string = "";
    public address: string = "0.0.0.0/24";
    public gateway: string = "0.0.0.0/24";
    public image_name: string = "";
    public _hardware: VirtualMachineTemplate | undefined = undefined;
    public _network: Network | null = null;
    public name_resource: string = `test`;

    constructor() {
        super();
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
    }

    generateConfigNode(): string {
        return `resource "proxmox_virtual_environment_vm" "${this.name_resource}" {
  name      = "${this.name}"
  node_name = "${this._hardware?.getProxmox()?.node_name}"

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

  disk {
    datastore_id = "${this._hardware?.datastore_id}"
    file_id      = ${this._hardware?.file_id}
    interface    = "${this._hardware?.interface}"
    iothread     = ${this._hardware?.iothread}
    discard      = "${this._hardware?.discard}"
    size         = ${this._hardware?.disc_size}
  }

  network_device {
    bridge = "${this._network?.name}"
  }
}
  
resource "proxmox_virtual_environment_download_file" "${this.image_name}" {
  content_type = "${this._hardware?.content_type}"
  datastore_id = "${this._hardware?.datastore_id}"
  node_name    = "${this._hardware?.getProxmox()?.node_name}"

  url = "${this._hardware?.url_source}"
}`

    }

    writeConfigFile(fileName: string) {
        const content = this.generateConfigFileContent();
        fs.writeFileSync(fileName, content);
    }
}

