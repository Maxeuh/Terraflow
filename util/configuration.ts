import {TerraNode} from "@/util/types";
import fs from "fs";

export class Configuration extends TerraNode {
    private nodes: TerraNode[] = [];

    public addNode(node: TerraNode) {
        this.nodes.push(node);
    }

    public removeNode(node: TerraNode) {
        this.nodes = this.nodes.filter(n => n !== node);
    }

    generateConfigNode(): string {
        return `
terraform {
  required_providers {
    proxmox = {
      source = "bpg/proxmox"
      version = "0.78.2"
    }
  }
}
        `;
    }

    getChildren(): TerraNode[] {
        return this.nodes;
    }

    createFile(fileName: string): void {
        const content = this.generateConfigFileContent();
        fs.writeFileSync(fileName, content);
    }
}