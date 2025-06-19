import { SiProxmox } from "react-icons/si";
import NodeTemplate, {DataProps} from "@/components/Nodes/Node";
import {Handle, Position, Node, NodeProps} from "@xyflow/react";
import React from "react";

export function ProxmoxNode(props: NodeProps<Node<DataProps>>) {
    return (
        <NodeTemplate icon={SiProxmox} label={"Proxmox"} props={props} background={"rgba(230, 113, 0, 0.8)"}>
            <Handle type="source" position={Position.Right} />
        </NodeTemplate>
    )
}

export default ProxmoxNode;