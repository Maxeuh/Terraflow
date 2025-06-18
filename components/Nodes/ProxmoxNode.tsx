import { SiProxmox } from "react-icons/si";
import Node from "@/components/Nodes/Node";

export function ProxmoxNode(props: unknown) {
    return (
        <Node icon={SiProxmox} label={"Proxmox"} props={props} background={"rgba(230, 113, 0, 0.8)"} />
    )
}

export default ProxmoxNode;