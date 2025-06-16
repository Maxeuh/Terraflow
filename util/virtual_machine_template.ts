import { FieldType, TerraNode } from "@/util/types";



export class VirtualMachineTemplate extends TerraNode {

  public datastore_id: string = "";
  public file_id: string = "";
  public interfaces: string = "";
  public iothread: boolean = false;
  public discard: string = "";
  public size: number = 0;
  public content_type: string = "";
  public node_name: string = "";
  public url: string = "";

    constructor(){
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

    generateConfigFileContent(): string {
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