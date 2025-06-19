"use client";

import NetworkNode from "@/components/Nodes/NetworkNode";
import ProxmoxNode from "@/components/Nodes/ProxmoxNode";
import VirtualMachineNode from "@/components/Nodes/VirtualMachineNode";
import { SettingsDrawer } from "@/components/SettingsDrawer/SettingsDrawer";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Configuration } from "@/util/configuration";
import {FormField, TerraNode} from "@/util/types";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";
import { VMService } from "@/util/virtual_machine_template_service";
import { Flex } from "@mantine/core";
import {
    addEdge,
    Background,
    BackgroundVariant, Connection,
    Controls, Edge, Node, NodeProps,
    NodeTypes, OnConnect, OnDelete,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import {Network} from "@/util/network";
import {ProxmoxProvider} from "@/util/proxmox";
import {VirtualMachine} from "@/util/virtual_machine";
import {DataProps} from "@/components/Nodes/Node";

const nodeTypes: NodeTypes = {
    Proxmox: ProxmoxNode,
    Network: NetworkNode,
    "Virtual Machine": VirtualMachineNode,
};

export default function Home() {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [drawerOpened, setDrawerOpened] = useState(false);
    const [drawerType, setDrawerType] = useState("");
    const [formFields, setFormFields] = useState<FormField[]>([]);

    const [config, setConfig] = useState(new Configuration());

    const vmServiceRef = useRef(new VMService(config));
    const [vmTemplates, setVmTemplates] = useState<VirtualMachineTemplate[]>(
        []
    );
    const [currentTemplate, setCurrentTemplate] =
        useState<VirtualMachineTemplate | null>(null);

    const onConnect: OnConnect = useCallback(
        (params: Connection) => {
            let oldEdges = [...edges];
            let newEdges = addEdge(params, edges);

            const edgesAdded = newEdges.filter(val => !oldEdges.includes(val));

            const edge: Connection = edgesAdded[0];

            const sourceNode = nodes.find((node) => node.id === edge.source);
            const targetNode = nodes.find((node) => node.id === edge.target);

            const sourceObject: TerraNode = sourceNode.data.object;
            const targetObject: TerraNode = targetNode.data.object;

            if (sourceObject.getNodeType() === "Proxmox") {
                const proxmox = sourceObject as ProxmoxProvider;
                const network = targetObject as Network;
                proxmox.addNetwork(network);
            } else if (targetObject.getNodeType() === "Virtual Machine") {
                const network = sourceObject as Network;
                const virtualMachine = targetObject as VirtualMachine;
                network.addMachine(virtualMachine);
            }

            console.log(config.generateConfigFileContent())

            setEdges(newEdges);
        },
        [setEdges, nodes]
    )

    const onDelete: OnDelete<Node, Edge> = useCallback(({nodes: nds, edges: edgs}: {nodes: Node[], edges: Edge[]}) => {
        const oldEdges = [...edges];
        edgs.map((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source);
            const targetNode = nodes.find((node) => node.id === edge.target);

            const sourceObject: TerraNode = sourceNode.data.object;
            const targetObject: TerraNode = targetNode.data.object;

            const sourceName = sourceObject.getNodeType();
            const targetName = targetObject .getNodeType();
            console.log(sourceName)
            console.log(targetName);


            if (sourceName == "Proxmox" && targetName == "Network") {
                const proxmox: ProxmoxProvider = sourceObject as ProxmoxProvider;
                const network: Network = targetObject as Network;
                proxmox.removeNetwork(network);
                console.log("ici")
            } else if (sourceName == "Network" && targetName == "Virtual Machine") {
                const network: Network = sourceObject as Network;
                const virtualMachine: VirtualMachine = targetObject as VirtualMachine;

                network.removeMachine(virtualMachine);
            }

        });

        nds.map((n: Node) => {
            const node: NodeProps<Node<DataProps>> = n as unknown as NodeProps<Node<DataProps>>;

            const nodeObject: TerraNode = node.data.object;
            const nodeName: string = nodeObject.getNodeType();

            if (nodeName == "Proxmox") {
                config.removeProvider(nodeObject as ProxmoxProvider);
            }

        });
        console.log(config.generateConfigFileContent())

        },
        [nodes]
    )

    useEffect(() => {
        const vmService = vmServiceRef.current;

        const handleTemplatesUpdated = (
            templates: VirtualMachineTemplate[]
        ) => {
            setVmTemplates((prevTemplates) => {
                if (prevTemplates === templates) {
                    return [...templates];
                }
                return templates;
            });
        };

        vmService.on("templates-updated", handleTemplatesUpdated);

        // Initialiser avec les templates existants
        setVmTemplates([...vmService.getAllVMTemplates()]);

        return () => {
            vmService.removeListener(
                "templates-updated",
                handleTemplatesUpdated
            );
        };
    }, []);

    const openDrawer = useCallback((title: string, forms: FormField[]) => {
        setDrawerType(title);
        setFormFields(forms);
        setDrawerOpened(true);
    }, []);

    const openCreateVMTemplateDrawer = useCallback(() => {
        const template = vmServiceRef.current.createVMTemplate();
        setCurrentTemplate(template);
        openDrawer("Create VM Template", template.getFormFields());
    }, [openDrawer]);

    const openEditVMTemplateDrawer = useCallback(
        (template: VirtualMachineTemplate) => {
            setCurrentTemplate(template);
            openDrawer("Edit VM Template", template.getFormFields());
        },
        [openDrawer]
    );

    const closeDrawer = useCallback(() => {
        setDrawerOpened(false);
        setCurrentTemplate(null);
    }, [drawerType]);

    const handleDrawerSubmit = useCallback(
        (updatedFields: FormField[]) => {
            if (currentTemplate) {
                if (drawerType === "Edit VM Template") {
                    vmServiceRef.current.updateVMTemplate(
                        currentTemplate,
                        updatedFields
                    );
                } else {
                    vmServiceRef.current.addVMTemplate(
                        currentTemplate,
                        updatedFields
                    );
                }
            }
            setDrawerOpened(false);
            setCurrentTemplate(null);
        },
        [currentTemplate, drawerType]
    );

    return (
        <ReactFlowProvider>
            <Flex flex={"row"} direction={"row"}>
                <Sidebar
                    config={config}
                    onOpenVMTemplateDrawer={openCreateVMTemplateDrawer}
                    onEditVMTemplate={(template) => {
                        openEditVMTemplateDrawer(template);
                    }}
                    onDeleteVMTemplate={(template) =>
                        vmServiceRef.current.removeVMTemplate(template)
                    }
                    vmTemplates={vmTemplates}
                />
                <SettingsDrawer
                    opened={drawerOpened}
                    onClose={closeDrawer}
                    onSubmit={handleDrawerSubmit}
                    title={drawerType}
                    forms={formFields}
                />
                <div style={{ width: "100vw", height: "calc(100vh - 56px)" }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDelete={onDelete}
                        colorMode={"system"}
                        proOptions={{ hideAttribution: true }}
                        snapGrid={[20, 20]}
                        snapToGrid={true}
                        nodeTypes={nodeTypes}
                    >
                        <Controls />
                        <Background variant={BackgroundVariant.Dots} />
                    </ReactFlow>
                </div>
            </Flex>
        </ReactFlowProvider>
    );
}
