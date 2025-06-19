import { TerraNode } from "@/util/types";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

interface CreateModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (object: TerraNode) => void;
    object: TerraNode;
}

export function CreateModal({
    opened,
    onClose,
    onSubmit,
    object,
}: CreateModalProps) {
    const [name, setName] = useState("");

    const handleSubmit = useCallback(() => {
        if (name.trim()) {
            object.name = name.trim();
            onSubmit(object);
            setName("");
            onClose();
        }
    }, [name, onSubmit, onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && opened) {
                handleSubmit();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [opened, handleSubmit]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Create ${object.getNodeType()}`}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <TextInput
                label="Name"
                placeholder={`Enter the name for ${object.getNodeType()}`}
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleSubmit();
                    }
                }}
                data-autofocus
            />
            <Group mt="md">
                <Button onClick={() => handleSubmit()}>OK</Button>
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
            </Group>
        </Modal>
    );
}
