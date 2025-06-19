import { v4 as uuidv4 } from 'uuid';

// This is the type of each field in the form
export enum FieldType {
    String,
    Integer,
    Float,
    Password,
    CheckBox
}

// Represents a form field with its name, value, type, and regex validation pattern
export type FormField = {
    name: string;
    value: any;
    type: FieldType;
    regex: RegExp;
    mandatory: boolean;
}

// Represent a node.
export abstract class TerraNode {
    protected _varTypes: FormField[] = [];
    private _type: string = "TerraNode";

    public name: string = "";
    private readonly _UUID: string;

    constructor(type: string) {
        this._UUID = uuidv4();
        this._type = type;
    }

    getNodeType(): string {
        return this._type;
    }

    getUUID(): string {
        return "tn-" + this._UUID;
    }

    toKebabCase(input: string): string {
        return input
            .normalize("NFD")                    // Sépare les accents des lettres (é → e + ́)
            .replace(/[\u0300-\u036f]/g, "")     // Supprime les accents
            .replace(/[^a-zA-Z0-9]+/g, '-')      // Remplace les séparateurs non alphanumériques par des tirets
            .replace(/([a-z])([A-Z])/g, '$1-$2') // Ajoute un tiret entre camelCase
            .toLowerCase()                       // Minuscule
            .replace(/^-+|-+$/g, '')             // Supprime les tirets en début/fin
            .replace(/--+/g, '-');               // Remplace les doubles tirets
    }

    getNodeID(): string {
        return this.getUUID() + "-" + this.toKebabCase(this.name);
    }

    /**
     * This method returns the form fields of the node
     * @returns {FormField[]} an array of FormField objects
     */
    getFormFields(): FormField[] {
        const fields: FormField[] = [];

        for (const key of Object.keys(this)) {
            if (/^_/.test(key)) {
                continue;
            }

            const value = (this as any)[key];

            // test key type :
            let fieldType: FieldType = FieldType.String;
            const attrType = typeof value;

            // Check if key in this.varTypes
            const varType: FormField | undefined = this._varTypes.find((v) => v.name === key);

            if (varType) {
                fields.push(varType);
            } else {
                if (attrType === "string") {
                    fieldType = FieldType.String;
                } else if (attrType === "number") {
                    fieldType = FieldType.Float;
                } else if (attrType === "boolean") {
                    fieldType = FieldType.CheckBox;
                }
                fields.push({
                    name: key,
                    value: value,
                    type: fieldType,
                    regex: /^.*$/,
                    mandatory: false
                })

            }

        }
        return fields;
    }

    generateConfigFileContent(): string {
        let content: string = "";

        content += this.generateConfigNode();


        for (const child of this.getChildren()) {
            content += "\n";
            content += child.generateConfigFileContent();
        }

        return content;
    }

    abstract generateConfigNode(): string;

    /**
     * This method sets the form fields of the node
     * @param fields
     */
    setFormFields(fields: FormField[]) {
        let hasChanged = false;
        
        for (const field of fields) {
            if (this.checkFormField(field.name, field.value)) {
                const oldValue = (this as any)[field.name];
                (this as any)[field.name] = field.value;
                
                // Si la valeur a changé, on marque qu'il y a eu un changement
                if (oldValue !== field.value) {
                    hasChanged = true;
                }
            }
        }
        
        // Si on utilise EventEmitter, on pourrait émettre un événement ici
        return hasChanged;
    }

    /**
     * This method checks if the form field is valid or not
     * This method is used by the setFormFields method
     * @param key the name of the field
     * @param value the value of the field
     *
     * @return true if the field is valid, false otherwise
     */
    checkFormField(key: string, value: any): Boolean {
        return true;
    }

    getChildren(): TerraNode[] {
        return [];
    }

}