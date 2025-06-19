import NodeComponent, { DataProps } from "@/components/Nodes/Node";
import {
    Connection,
    Edge,
    Handle,
    Node,
    NodeProps,
    Position,
    useNodeConnections,
    useReactFlow,
} from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import React from "react";
import { PiNetwork } from "react-icons/pi";

export function ProxmoxNode(props: NodeProps<Node<DataProps>>) {
    const [count, setCount] = React.useState(0);
    const flowInstance = useReactFlow<Node, Edge>();

    const connections = useNodeConnections({
        handleType: "target",
        onDisconnect: () => {
            setCount(0);
        },
        onConnect: () => {
            setCount(count + 1);
        },
    });

    const isValidConnection = (edge: EdgeBase | Connection) => {
        const targetNode: NodeProps<Node<DataProps>> = flowInstance.getNode(
            edge.target
        ) as unknown as NodeProps<Node<DataProps>>;
        const sourceNode: NodeProps<Node<DataProps>> = flowInstance.getNode(
            edge.source
        ) as unknown as NodeProps<Node<DataProps>>;
        return (
            targetNode.data.object.getNodeType() == "VirtualMachine" ||
            sourceNode.data.object.getNodeType() == "Proxmox"
        );
    };

    return (
        <NodeComponent
            icon={PiNetwork}
            label={"Network"}
            props={props}
            background={"rgb(66, 135, 245)"}
        >
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={count === 0}
                isValidConnection={isValidConnection}
                style={{
                    backgroundColor: "rgb(230, 113, 0)",
                    zIndex: 1,
                    width: 10,
                    height: 10,
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{
                    backgroundColor: "rgb(66, 135, 245)",
                    zIndex: 1,
                    width: 10,
                    height: 10,
                }}
            />
        </NodeComponent>
    );
}

export default ProxmoxNode;
