import { FieldType, FormField } from "@/util/types";
import { NumberInput, PasswordInput, Switch, TextInput } from "@mantine/core";
import { Md123, MdAbc, MdPassword } from "react-icons/md";

interface FormGeneratorProps {
    forms: FormField[];
    onChange?: (updatedForms: FormField[]) => void;
}

export default function FormGenerator({ forms, onChange }: FormGeneratorProps) {
    return forms.map((form, index) => (
        <div key={index} className="form-field">
            {form.type !== FieldType.CheckBox && (
                <label htmlFor={form.name}>
                    {form.label}{" "}
                    {form.mandatory && <span style={{ color: "red" }}>*</span>}
                </label>
            )}
            {form.type === FieldType.String && (
                <TextInput
                    variant="default"
                    leftSection={<MdAbc />}
                    id={form.name}
                    defaultValue={form.value}
                    onChange={(e) => {
                        form.value = e.target.value;
                        onChange && onChange([...forms]);
                    }}
                    pattern={form.regex.source}
                    required={form.mandatory}
                />
            )}
            {form.type === FieldType.Integer && (
                <NumberInput
                    variant="default"
                    leftSection={<Md123 />}
                    id={form.name}
                    defaultValue={form.value}
                    onChange={(value) => {
                        form.value = value;
                        onChange && onChange([...forms]);
                    }}
                    required={form.mandatory}
                />
            )}
            {form.type === FieldType.Float && (
                <NumberInput
                    variant="default"
                    leftSection={<Md123 />}
                    id={form.name}
                    defaultValue={form.value}
                    decimalScale={2}
                    step={0.01}
                    onChange={(value) => {
                        form.value = value;
                        onChange && onChange([...forms]);
                    }}
                    required={form.mandatory}
                />
            )}
            {form.type === FieldType.Password && (
                <PasswordInput
                    variant="default"
                    leftSection={<MdPassword />}
                    id={form.name}
                    defaultValue={form.value}
                    onChange={(e) => {
                        form.value = e.target.value;
                        onChange && onChange([...forms]);
                    }}
                    required={form.mandatory}
                />
            )}
            {form.type === FieldType.CheckBox && (
                <Switch
                    id={form.name}
                    defaultChecked={Boolean(form.value)}
                    onChange={(e) => {
                        form.value = e.target.checked;
                        onChange && onChange([...forms]);
                    }}
                    required={form.mandatory}
                    label={
                        form.name +
                        (form.mandatory ? (
                            <span style={{ color: "red" }}>*</span>
                        ) : (
                            ""
                        ))
                    }
                />
            )}
        </div>
    ));
}
