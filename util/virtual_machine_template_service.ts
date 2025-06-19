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
     * Met à jour un modèle de VM existant
     * @param currentTemplate Le modèle de VM actuel à mettre à jour
     * @param updatedFields Les champs du formulaire mis à jour
     */
    updateVMTemplate(currentTemplate: VirtualMachineTemplate, updatedFields: FormField[]) {
        // Mettre à jour les champs du template et vérifier s'il y a eu des changements
        const hasChanged = currentTemplate.setFormFields(updatedFields);
        
        // S'assurer que le modèle est dans la configuration
        if (!this._config.templates.includes(currentTemplate)) {
            this._config.addTemplate(currentTemplate);
        }
        
        // Forcer une mise à jour de l'interface utilisateur, même si les champs n'ont pas changé
        // Cela garantit que tous les composants qui utilisent ces templates seront rafraîchis
        const updatedTemplates = [...this.getAllVMTemplates()];
        
        // Émettre l'événement de mise à jour avec une nouvelle référence de tableau
        this.emit('templates-updated', updatedTemplates);
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
        
        // Émettre l'événement avec une nouvelle référence de tableau
        this.emit('templates-updated', [...this.getAllVMTemplates()]);
    }
    
    /**
     * Supprime un modèle de VM de la configuration
     * @param template Le modèle de VM à supprimer
     */
    removeVMTemplate(template: VirtualMachineTemplate): void {
        this._config.removeTemplate(template);
        // Émettre l'événement avec une nouvelle référence de tableau
        this.emit('templates-updated', [...this.getAllVMTemplates()]);
    }
    
    /**
     * Récupère tous les modèles de VM
     * @returns La liste des modèles de VM
     */
    getAllVMTemplates(): VirtualMachineTemplate[] {
        return this._config.templates;
    }
}