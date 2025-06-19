import { TerraNode } from "@/util/types";
import { Box, Button, Flex } from "@mantine/core";
import { Node, NodeProps } from "@xyflow/react";
import React from "react";
import { IoSettingsSharp } from "react-icons/io5";

export type DataProps = {
    object: TerraNode;
};

interface NodeComponentProps {
    icon: React.FC<any>;
    label: string;
    props: NodeProps<Node<DataProps>>;
    background: string;
    children: React.ReactNode;
}

export function NodeComponent({
    icon: Icon,
    label,
    props,
    background,
    children,
}: NodeComponentProps) {
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
                    textTransform: "uppercase",
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
                </Box>
                <Button
                    style={{ position: "absolute", bottom: 3, right: 3 }}
                    size="xs"
                    variant="subtle"
                    color="gray"
                    radius="xl"
                >
                    <IoSettingsSharp />
                </Button>
            </Flex>
        </Box>
    );
}

export default NodeComponent;
