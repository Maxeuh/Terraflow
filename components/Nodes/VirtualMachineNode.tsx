import { PiComputerTowerBold } from "react-icons/pi";
import Node from "@/components/Nodes/Node";

export function ProxmoxNode(props: any) {
    return (
        <Node icon={PiComputerTowerBold} label={"Virtual Machine"} props={props} background={"rgba(237, 7, 180, 0.8)"} />
    )
}

export default ProxmoxNode;