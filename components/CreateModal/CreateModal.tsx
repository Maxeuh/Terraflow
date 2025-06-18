import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

interface CreateModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (name: string, openSettings: boolean) => void;
    type: string;
}

export function CreateModal({
    opened,
    onClose,
    onSubmit,
    type,
}: CreateModalProps) {
    const [name, setName] = useState("");

    const handleSubmit = useCallback(
        (openSettings: boolean) => {
            if (name.trim()) {
                onSubmit(name, openSettings);
                setName("");
                onClose();
            }
        },
        [name, onSubmit, onClose]
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && opened) {
                handleSubmit(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [opened, handleSubmit]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Create ${type}`}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <TextInput
                label="Name"
                placeholder={`Enter the name for ${type}`}
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleSubmit(false);
                    }
                }}
                data-autofocus
            />
            <Group mt="md">
                <Button onClick={() => handleSubmit(false)}>OK</Button>
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={() => handleSubmit(true)} variant="outline">
                    Settings
                </Button>
            </Group>
        </Modal>
    );
}
