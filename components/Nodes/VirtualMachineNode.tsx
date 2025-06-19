import { PiComputerTowerBold } from "react-icons/pi";
import NodeComponent, {DataProps} from "@/components/Nodes/Node";
import {Handle, Node, Position} from "@xyflow/react";
import React from "react";

export function ProxmoxNode(props: Node<DataProps>) {
    return (
        <NodeComponent icon={PiComputerTowerBold} label={"Virtual Machine"} props={props} background={"rgba(237, 7, 180, 0.8)"}>
            <Handle type="target" position={Position.Left} />
        </NodeComponent>
    )
}

export default ProxmoxNode;