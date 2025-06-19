import NodeComponent, { DataProps } from "@/components/Nodes/Node";
import { VirtualMachine } from "@/util/virtual_machine";
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
import { PiComputerTowerBold } from "react-icons/pi";

export function ProxmoxNode(props: NodeProps<Node<DataProps>>) {
    const [count, setCount] = React.useState(0);

    const connections = useNodeConnections({
        handleType: "target",
        onDisconnect: () => {
            setCount(0);
        },
        onConnect: () => {
            setCount(count + 1);
        },
    });

    const flowInstance = useReactFlow<Node, Edge>();

    const isValidConnection = (edge: EdgeBase | Connection) => {
        const targetNode: NodeProps<Node<DataProps>> = flowInstance.getNode(
            edge.source
        ) as unknown as NodeProps<Node<DataProps>>;
        return targetNode.data.object.getNodeType() == "Network";
    };

    return (
        <NodeComponent
            icon={PiComputerTowerBold}
            label={(props.data.object as VirtualMachine)._hardware?.name}
            props={props}
            background={"rgb(237, 7, 180)"}
        >
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={count === 0}
                isValidConnection={isValidConnection}
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
