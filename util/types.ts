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
}

// Represent a node.
export abstract class TerraNode {
    protected _varTypes: FormField[] = [];

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
                }
                fields.push({
                    name: key,
                    value: value,
                    type: fieldType,
                    regex: /^.*$/
                })

            }

        }
        return fields;
    }

    abstract generateConfigFileContent(): string;

    /**
     * This method sets the form fields of the node
     * @param fields
     */
    setFormFields(fields: FormField[]) {
        for (const field of fields) {
            if (this.checkFormField(field.name, field.value)) {
                (this as any)[field.name] = field.value;
            }
        }
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


}