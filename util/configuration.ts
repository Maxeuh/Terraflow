import { ProxmoxProvider } from "@/util/proxmox";
import { TerraNode } from "@/util/types";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";

export class Configuration extends TerraNode {
    constructor() {
        super("Configuration");
    }

    public providers: ProxmoxProvider[] = [];

    templates: VirtualMachineTemplate[] = [];

    public addProvider(node: ProxmoxProvider) {
        this.providers.push(node);
    }

    public removeProvider(node: ProxmoxProvider) {
        this.providers = this.providers.filter(n => n !== node);
    }

    public addTemplate(template: VirtualMachineTemplate) {
        this.templates.push(template);
        template._configuration = this;
    }

    public removeTemplate(template: VirtualMachineTemplate) {
        this.templates = this.templates.filter(t => t !== template);
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
        let children: TerraNode[] = [];
        children = children.concat(this.providers);
        children = children.concat(this.templates);
        return children;
    }


    private generateFile(content: string, filename: string = 'main.tf') {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    generateTerraformFile(): void {
        this.generateFile(this.generateConfigFileContent())
    }
}