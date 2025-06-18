import { PiComputerTowerBold } from "react-icons/pi";
import Node from "@/components/Nodes/Node";
import {Handle, Position} from "@xyflow/react";
import React from "react";

export function ProxmoxNode(props: any) {
    return (
        <Node icon={PiComputerTowerBold} label={"Virtual Machine"} props={props} background={"rgba(237, 7, 180, 0.8)"}>
            <Handle type="target" position={Position.Left} />
        </Node>
    )
}

export default ProxmoxNode;