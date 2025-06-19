import { PiComputerTowerBold } from "react-icons/pi";
import NodeComponent, {DataProps} from "@/components/Nodes/Node";
import {Connection, Edge, Handle, Node, NodeProps, Position, useNodeConnections, useReactFlow} from "@xyflow/react";
import React from "react";
import {EdgeBase} from "@xyflow/system";

export function ProxmoxNode(props: NodeProps<Node<DataProps>>) {
    const [count, setCount] = React.useState(0);


    const connections = useNodeConnections({
        handleType: 'target',
        onDisconnect: () => {
            setCount(0);
        },
        onConnect: ()=> {
            setCount(count + 1);
        }
    });

    const flowInstance = useReactFlow<Node, Edge>();

    const isValidConnection = (edge: EdgeBase | Connection) => {
        const targetNode: NodeProps<Node<DataProps>> = flowInstance.getNode(edge.source) as unknown as NodeProps<Node<DataProps>>;
        return targetNode.data.object.getNodeType() == "Network";
    }

    return (
        <NodeComponent icon={PiComputerTowerBold} label={"Virtual Machine"} props={props} background={"rgba(237, 7, 180, 0.8)"}>
            <Handle type="target" position={Position.Left} isConnectable={count === 0} isValidConnection={isValidConnection} />
        </NodeComponent>
    )
}

export default ProxmoxNode;