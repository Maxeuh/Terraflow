import { SettingsDrawer } from "@/components/SettingsDrawer/SettingsDrawer";
import { TerraNode } from "@/util/types";
import { Box, Button, Flex } from "@mantine/core";
import { Node, NodeProps } from "@xyflow/react";
import React, { useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";

export type DataProps = {
    object: TerraNode;
};

interface NodeComponentProps {
    icon: React.FC<any>;
    props: NodeProps<Node<DataProps>>;
    background: string;
    children: React.ReactNode;
    label?: string;
}

export default function NodeComponent({
    icon: Icon,
    props,
    background,
    children,
    label,
}: NodeComponentProps) {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const terraNode = props.data.object;
    const [originalFormFields, setOriginalFormFields] = useState<any>(null);

    const handleSettingsClick = () => {
        // Recalculer les champs de formulaire à chaque ouverture pour s'assurer
        // que toutes les valeurs actuelles sont utilisées
        const currentFormFields = terraNode.getFormFields();
        setOriginalFormFields(currentFormFields);
        setSettingsOpened(true);
    };

    const handleSettingsClose = () => {
        if (originalFormFields) {
            terraNode.setFormFields(originalFormFields);
        }
        setSettingsOpened(false);
    };

    const handleFormSubmit = (formData: any) => {
        terraNode.setFormFields(formData);
        setSettingsOpened(false);
        setOriginalFormFields(null);
    };

    return (
        <Box className="text-updater-node">
            {children}
            <Flex
                p={5}
                bg={"var(--background)"}
                bd={`5px solid ${background}`}
                style={{
                    borderRadius: "10px",
                    position: "relative",
                    fontWeight: 700,
                }}
                w={250}
                h={100}
                align={"center"}
                justify={"center"}
            >
                {props.data.object.name}
                <Box
                    px={8}
                    py={4}
                    style={{
                        position: "absolute",
                        top: 7,
                        left: 7,
                        fontWeight: 700,
                        backgroundColor: background,
                        color: "white",
                        borderRadius: "16px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "12px",
                    }}
                >
                    <Icon />
                    {label}
                </Box>
                <Button
                    style={{ position: "absolute", bottom: 3, right: 3 }}
                    size="xs"
                    variant="subtle"
                    color="gray"
                    radius="xl"
                    onClick={handleSettingsClick}
                >
                    <IoSettingsSharp />
                </Button>
            </Flex>

            <SettingsDrawer
                opened={settingsOpened}
                onClose={handleSettingsClose}
                onSubmit={handleFormSubmit}
                title={`Edit ${terraNode.name || label}`}
                forms={terraNode.getFormFields()}
            />
        </Box>
    );
}
