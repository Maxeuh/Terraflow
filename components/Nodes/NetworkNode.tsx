import Node from "@/components/Nodes/Node";
import { PiComputerTowerBold, PiNetwork } from "react-icons/pi";
import {Handle, Position} from "@xyflow/react";
import React from "react";

export function ProxmoxNode(props: any) {
    return (
        <Node icon={PiNetwork} label={"Network"} props={props} background={"rgba(66, 135, 245, 0.8)"}>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </Node>
    )
}

export default ProxmoxNode;