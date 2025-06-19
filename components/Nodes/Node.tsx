import React, { useCallback } from 'react';
import {Box, Flex, Paper, Text} from "@mantine/core";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import {TerraNode} from "@/util/types";

export type DataProps = {
    object: TerraNode
}

export function NodeComponent({ icon: Icon, label, props, background, children }: { icon: React.FC<any>; label: string, props: NodeProps<Node<DataProps>>, background: string, children: any}) {
    const onChange = useCallback((evt: any) => {
        console.log(evt.target.value);
    }, []);
    console.log(props)
    return (
        <div className="text-updater-node">
            {children}

            <div style={{borderRadius: "4px", overflow: "hidden", padding: "10px", backgroundColor: background, color: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"}}>

                <Flex
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                    gap={"xs"}
                >
                    <Icon color={"white"} />
                    <Text color={"white"} fw={700} style={{fontSize: "8px"}}>{label}</Text>

                </Flex>
                <p style={{fontWeight: "bold", fontSize: '8px', textAlign: "center"}}>{props.data.object.name}</p>

            </div>
        </div>
    );
}

export default NodeComponent;