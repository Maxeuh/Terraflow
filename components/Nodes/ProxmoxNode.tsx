import { SiProxmox } from "react-icons/si";
import NodeTemplate, {DataProps} from "@/components/Nodes/Node";
import {Handle, Position, Node, NodeProps, useReactFlow, Edge, Connection} from "@xyflow/react";
import React from "react";
import {EdgeBase} from "@xyflow/system";

export function ProxmoxNode(props: NodeProps<Node<DataProps>>) {

    const flowInstance = useReactFlow<Node, Edge>();

    const isValidConnection = (edge: EdgeBase | Connection) => {
        const targetNode: NodeProps<Node<DataProps>> = flowInstance.getNode(edge.target) as unknown as NodeProps<Node<DataProps>>;
        return targetNode.data.object.getNodeType() == "Network";
    }

    return (
        <NodeTemplate icon={SiProxmox} label={"Proxmox"} props={props} background={"rgba(230, 113, 0, 0.8)"}>
            <Handle
                type="source"
                position={Position.Right}
                isValidConnection={isValidConnection}
            />
        </NodeTemplate>
    )
}

export default ProxmoxNode;