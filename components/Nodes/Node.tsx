import { TerraNode } from "@/util/types";
import { Box, Flex } from "@mantine/core";
import { Node, NodeProps } from "@xyflow/react";
import React from "react";

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
            <Box
                p={5}
                bg={"var(--background)"}
                bd={`5px solid ${background}`}
                style={{ borderRadius: "10px" }}
                w={250}
                h={100}
            >
                <Box
                    px={8}
                    py={4}
                    style={{
                        fontWeight: 700,
                        textTransform: "uppercase",
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
                <Flex
                    justify="center"
                    align="center"
                    mt={6}
                    style={{ fontWeight: 600, textTransform: "uppercase" }}
                >
                    {props.data.object.name}
                </Flex>
            </Box>
        </Box>
    );
}

export default NodeComponent;
