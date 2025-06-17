import {FieldType, TerraNode} from "@/util/types";
import { ProxmoxProvider } from "./proxmox";


export class VirtualMachineTemplate extends TerraNode {
    public name : string = "default_vm";
    public stop_on_destroy : boolean = true;
    //disk
    public datastore_id : string = "local_lvm";
    public file_id : string = "proxmox_virtual_environment_download_file.centos_cloud_image.id";
    public interface : string = "virtio0";
    public iothread : boolean = true; 
    public discard : boolean = true;
    public disc_size : number = 20;
    

    //source
    public content_type : string = "iso"
    public source_name : string = "default_cloud_image"
    public source_datastore_id : string = "local-lvm";
    public source_interface : string = "virtio0";
    public url_source : string = "default_source.com";
    public source_file_name : string = "default_source ";
    private _proxmox : ProxmoxProvider | null = null;

    constructor() {
        super();
        this._varTypes = [
            {
                name: "VM name",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]$/,
                value: this.name
            },{
                name: "stop_on_destroy",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.stop_on_destroy
            }, {
                name: "datastore id ",
                type: FieldType.String,
                regex: /.*/,
                value: this.datastore_id
            }, {
                name: "file id",
                type: FieldType.String,
                regex: /.*/,
                value: this.file_id
            }, {
                name: "interface",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.interface
            }, {
                name: "iothread",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.iothread
            }, {
                name: "discard",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.discard
            },{
                name: "disc size",
                type: FieldType.Integer,
                regex: /.*/,
                value: this.disc_size
            },{
                name: "content type",
                type: FieldType.String,
                regex: /.*/,
                value: this.content_type
            }, {
                name: "source name",
                type: FieldType.String,
                regex: /.*/,
                value: this.source_name
            }, {
                name: "source datastore id",
                type: FieldType.String,
                regex: /.*/,
                value: this.source_datastore_id
            }, {
                name: "source interface",
                type: FieldType.String,
                regex: /.*/,
                value: this.interface
            },{
                name: "url source",
                type: FieldType.String,
                regex: /.*/,
                value: this.url_source
            },{
                name: "source file name",
                type: FieldType.String,
                regex: /.*/,
                value: this.source_file_name
            }
        ]
    }
    setProxmox(proxmox : ProxmoxProvider){
        this._proxmox = proxmox;
    }







    generateConfigNode(): string {
        return `"proxmox_virtual_environment_vm" "${this.name}" {
    name = "${this.name}"
    node_name = "${this._proxmox?.node_name}"

    stop_on_destroy = ${this.stop_on_destroy}

    disk {
        datastore_id = "${this.datastore_id}"
        file_id = ${this.file_id}
        interface = "${this.interface}"
        iothread = ${this.iothread}
        discard = "${this.discard?"on":"off"}"
        size = ${this.disc_size}
    }
}
resource "proxmox_virtual_environment_download_file" "${this.source_name}" {
    content_type = "${this.content_type}"
    datastore_id = "${this.source_datastore_id}"
    node_name = "${this._proxmox?.node_name}"
    url = "${this.url_source}"
    file_name = "${this.source_file_name}" 

}
`
    }   

}
















    /*
    public datastore_id: string = "";
    public file_id: string = "";
    public interfaces: string = "";
    public iothread: boolean = false;
    public discard: string = "";
    public size: number = 0;
    public content_type: string = "";
    public node_name: string = "";
    public url: string = "";

    constructor() {
        super();
        this._varTypes = [
            {
                name: "size",
                type: FieldType.Integer,
                regex: /^\d+$/,
                value: this.size
            }, {
                name: "iothread",
                type: FieldType.CheckBox,
                regex: /^(true|false)$/,
                value: this.iothread
            }, {
                name: "url",
                type: FieldType.String,
                regex: /^(https?|ftp):\/\/[^\s$.?#].[^\s]*$/,
                value: this.url
            }
        ]
    }

    generateConfigNode(): string {
        return `# Hardware configuration
datastore_id = "${this.datastore_id}"
file_id = "${this.file_id}"
interfaces = "${this.interfaces}"
iothread = ${this.iothread}
discard = "${this.discard}"
size = ${this.size}
content_type = "${this.content_type}"
node_name = "${this.node_name}"
url = "${this.url}"
`;
    }
}
*/ 