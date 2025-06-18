import { Configuration } from "@/util/configuration";
import { FormField } from "@/util/types";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";
import { EventEmitter } from "events";

export class VMService extends EventEmitter {
    private _config: Configuration;
    
    constructor(config: Configuration) {
        super();
        this._config = config;
    }
    
    /**
     * Crée un nouveau modèle de VM
     * @returns Le modèle de VM créé
     */
    createVMTemplate(): VirtualMachineTemplate {
        // On crée un template sans l'ajouter à la configuration tout de suite
        const template = new VirtualMachineTemplate(this._config);
        // Important : On retire le template de la configuration car il sera ajouté plus tard
        this._config.removeTemplate(template);
        return template;
    }
    
    /**
     * Ajoute un modèle de VM à la configuration
     * @param template Le modèle de VM à ajouter
     * @param fields Les champs du formulaire mis à jour
     */
    addVMTemplate(template: VirtualMachineTemplate, fields: FormField[]): void {
        // Mettre à jour les champs du template
        if (fields && fields.length > 0) {
            template.setFormFields(fields);
        }
        
        // Ajouter le template à la configuration
        this._config.addTemplate(template);
        
        // Émettre l'événement
        this.emit('templates-updated', this.getAllVMTemplates());
    }
    
    /**
     * Supprime un modèle de VM de la configuration
     * @param template Le modèle de VM à supprimer
     */
    removeVMTemplate(template: VirtualMachineTemplate): void {
        this._config.removeTemplate(template);
        this.emit('templates-updated', this.getAllVMTemplates());
    }
    
    /**
     * Récupère tous les modèles de VM
     * @returns La liste des modèles de VM
     */
    getAllVMTemplates(): VirtualMachineTemplate[] {
        return this._config.templates;
    }
}