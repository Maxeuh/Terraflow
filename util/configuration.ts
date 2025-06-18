import {TerraNode} from "@/util/types";
import fs from "fs";

export class Configuration extends TerraNode {
    private providers: TerraNode[] = [];

    constructor(name: string) {
        super(name);
    }

    public addProvider(node: TerraNode) {
        this.providers.push(node);
    }

    public removeProvider(node: TerraNode) {
        this.providers = this.providers.filter(n => n !== node);
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
        return this.providers;
    }

    createFile(fileName: string): void {
        const content = this.generateConfigFileContent();
        fs.writeFileSync(fileName, content);
    }
}