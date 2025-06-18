import Node from "@/components/Nodes/Node";
import { PiComputerTowerBold, PiNetwork } from "react-icons/pi";

export function ProxmoxNode(props: any) {
    return (
        <Node icon={PiNetwork} label={"Network"} props={props} background={"rgba(66, 135, 245, 0.8)"}/>
    )
}

export default ProxmoxNode;