import React, { useCallback } from 'react';
import {Box, Flex, Paper, Text} from "@mantine/core";
import {Handle, Position} from "@xyflow/react";

export function ProxmoxNode({ icon: Icon, label, props, background }: { icon: React.FC<any>; label: string, props: any, background: string }) {
    const onChange = useCallback((evt: any) => {
        console.log(evt.target.value);
    }, []);
    console.log(props)
    return (
        <div className="text-updater-node">
            <Handle type="source" position={Position.Left} />
            <Handle type="target" position={Position.Right} />

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
                <span style={{fontWeight: "bold", fontSize: '8px'}}>Nom a changer</span>

            </div>
        </div>
    );
}

export default ProxmoxNode;