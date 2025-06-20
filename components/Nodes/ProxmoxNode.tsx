import NodeTemplate, { DataProps } from "@/components/Nodes/Node";
import {
    Connection,
    Edge,
    Handle,
    Node,
    NodeProps,
    Position,
    useReactFlow,
} from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import { SiProxmox } from "react-icons/si";

export function ProxmoxNode(props: NodeProps<Node<DataProps>>) {
    const flowInstance = useReactFlow<Node, Edge>();

    const isValidConnection = (edge: EdgeBase | Connection) => {
        const targetNode: NodeProps<Node<DataProps>> = flowInstance.getNode(
            edge.target
        ) as unknown as NodeProps<Node<DataProps>>;
        return targetNode.data.object.getNodeType() == "Network";
    };

    return (
        <NodeTemplate
            icon={SiProxmox}
            props={props}
            background={"rgb(230, 113, 0)"}
        >
            <Handle
                type="source"
                position={Position.Right}
                isValidConnection={isValidConnection}
                style={{
                    backgroundColor: "rgb(230, 113, 0)",
                    zIndex: 1,
                    width: 10,
                    height: 10,
                }}
            />
        </NodeTemplate>
    );
}

export default ProxmoxNode;
