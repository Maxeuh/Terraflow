import { FieldType, TerraNode } from "@/util/types";
import { VirtualMachine } from "@/util/virtual_machine"; // Adjust the import path as necessary
import * as fs from "fs";

export class Network extends TerraNode {

    private machines: VirtualMachine[] = [];
    public node_name: string = "";
    public name: string = "";
    public img_network: string = "";
    public address: string = "0.0.0.0/24";
    public comment: string = "comment";
    public name_resource_network: string = "";

    constructor(){
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
    }
    getMachines(): VirtualMachine[] {
        return this.machines;
    }

    generateConfigFileContent(): string {
        return  `resource "${this.name_resource_network}" "${this.name}" {
  depends_on = [
    ${this.img_network}
  ]

  node_name = "${this.node_name}"
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
