import { SiProxmox } from "react-icons/si";
import Node from "@/components/Nodes/Node";
import {Handle, Position} from "@xyflow/react";
import React from "react";

export function ProxmoxNode(props: unknown) {
    return (
        <Node icon={SiProxmox} label={"Proxmox"} props={props} background={"rgba(230, 113, 0, 0.8)"}>
            <Handle type="source" position={Position.Right} />
        </Node>
    )
}

export default ProxmoxNode;