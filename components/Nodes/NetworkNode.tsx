import NodeComponent, {DataProps} from "@/components/Nodes/Node";
import { PiComputerTowerBold, PiNetwork } from "react-icons/pi";
import {Handle, Node, Position} from "@xyflow/react";
import React from "react";

export function ProxmoxNode(props: Node<DataProps>) {
    return (
        <NodeComponent icon={PiNetwork} label={"Network"} props={props} background={"rgba(66, 135, 245, 0.8)"}>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </NodeComponent>
    )
}

export default ProxmoxNode;