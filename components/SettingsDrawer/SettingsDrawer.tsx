import FormGenerator from "@/components/FormGenerator.tsx/FormGenerator";
import { FormField } from "@/util/types";
import { Button, Drawer, Flex, Group, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

interface SettingsDrawerProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (formData: FormField[]) => void;
    title: string;
    forms: FormField[];
}

export function SettingsDrawer({
    opened,
    onClose,
    onSubmit,
    title,
    forms: initialForms,
}: SettingsDrawerProps) {
    const [forms, setForms] = useState<FormField[]>(initialForms);
    const [isFormValid, setIsFormValid] = useState(true);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const trySubmit = (forms: FormField[]) => {
        const nameField = forms.find(
            (form) => form.name.toLowerCase() === "name"
        );
        if (nameField && !nameField.value) {
            alert('The "name" field is mandatory and cannot be empty.');
            return {
                isValid: false,
                errorMessages: ["Name field is mandatory"],
            };
        }

        if (
            !isFormValid &&
            !confirm(
                `There ${errorMessages.length > 1 ? "are" : "is"} ${
                    errorMessages.length
                } error${
                    errorMessages.length > 1 ? "s" : ""
                } in the form:\n${errorMessages
                    .map((msg) => `- ${msg}`)
                    .join("\n")}\n\nDo you want to close the form?`
            )
        ) {
            return;
        }
        onSubmit(forms);
    };

    const checkForm = useCallback((formFields: FormField[]) => {
        let isValid = true;
        let errors: string[] = [];

        for (const form of formFields) {
            if (
                form.mandatory &&
                (!form.value || String(form.value).trim() === "")
            ) {
                isValid = false;
                errors.push(`Field "${form.name}" is required`);
            }

            if (
                form.regex &&
                form.value &&
                !new RegExp(form.regex).test(String(form.value))
            ) {
                isValid = false;
                errors.push(`Field "${form.name}" has invalid format`);
            }
        }

        setIsFormValid(isValid);
        setErrorMessages(errors);
        return { isValid, errorMessages: errors };
    }, []);

    useEffect(() => {
        setForms(initialForms);
    }, [initialForms]);

    useEffect(() => {
        checkForm(forms);
    }, [forms, checkForm]);

    const handleFormChange = (updatedForms: FormField[]) => {
        setForms(updatedForms);
        checkForm(updatedForms);
    };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            closeOnClickOutside={false}
            position="right"
            title={title}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Flex direction="column" gap="md">
                <FormGenerator forms={forms} onChange={handleFormChange} />
            </Flex>
            {errorMessages.length > 0 && (
                <div style={{ color: "red", marginTop: "10px" }}>
                    {errorMessages.map((msg, i) => (
                        <Text key={i} size="xs" c={"red"}>
                            {msg}
                        </Text>
                    ))}
                </div>
            )}
            <Group mt="md">
                <Button onClick={() => trySubmit(forms)}>OK</Button>
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
            </Group>
        </Drawer>
    );
}
