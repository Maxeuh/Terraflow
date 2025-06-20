"use client";

import { useHeaderContent } from "@/components/Header/HeaderContext";
import { ImportModal } from "@/components/ImportModal/ImportModal";
import NetworkNode from "@/components/Nodes/NetworkNode";
import ProxmoxNode from "@/components/Nodes/ProxmoxNode";
import VirtualMachineNode from "@/components/Nodes/VirtualMachineNode";
import { SettingsDrawer } from "@/components/SettingsDrawer/SettingsDrawer";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Configuration } from "@/util/configuration";
import { exportToFile } from "@/util/export_import";
import { createNodesAndEdges } from "@/util/flow_utils";
import { Network } from "@/util/network";
import { ProxmoxProvider } from "@/util/proxmox";
import { FormField, TerraNode } from "@/util/types";
import { VirtualMachine } from "@/util/virtual_machine";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";
import { VMService } from "@/util/virtual_machine_template_service";
import { Button, Flex, Menu, useMantineTheme } from "@mantine/core";
import {
    addEdge,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    Node,
    NodeTypes,
    OnConnect,
    OnDelete,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { FaSave } from "react-icons/fa";
import { FaChevronDown, FaFileExport, FaFileImport } from "react-icons/fa6";

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
    const [importModalOpened, setImportModalOpened] = useState(false);
    const theme = useMantineTheme();

    const vmServiceRef = useRef(new VMService(config));
    const [vmTemplates, setVmTemplates] = useState<VirtualMachineTemplate[]>(
        []
    );
    const [currentTemplate, setCurrentTemplate] =
        useState<VirtualMachineTemplate | null>(null);

    const { setHeaderContent } = useHeaderContent();

    useEffect(() => {
        setHeaderContent(
            <>
                <Button onClick={() => config.generateTerraformFile()}>
                    <FaFileExport style={{ marginRight: 8 }} /> Exporter
                    Terraform
                </Button>

                <Menu>
                    <Menu.Target>
                        <Button variant="outline">
                            <FaSave style={{ marginRight: 8 }} /> Sauvegarde{" "}
                            <FaChevronDown style={{ marginLeft: 8 }} />
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={
                                <FaFileExport style={{ marginRight: 4 }} />
                            }
                            onClick={() => exportToFile(config)}
                        >
                            Exporter
                        </Menu.Item>
                        <Menu.Item
                            leftSection={
                                <FaFileImport style={{ marginRight: 4 }} />
                            }
                            onClick={() => setImportModalOpened(true)}
                        >
                            Importer
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </>
        );

        return () => {
            setHeaderContent(null);
        };
    }, [setHeaderContent, config, theme.colors]);

    const onConnect: OnConnect = useCallback(
        (params: Connection) => {
            // Utiliser directement les paramètres de connexion fournis
            const sourceNode = nodes.find((node) => node.id === params.source);
            const targetNode = nodes.find((node) => node.id === params.target);

            if (sourceNode && targetNode) {
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
            }

            // Ajouter la connexion à l'état des arêtes
            setEdges((eds) => addEdge(params, eds));
        },
        [nodes, config]
    );

    const onDelete: OnDelete<Node, Edge> = useCallback(
        ({ nodes: nds, edges: edgs }: { nodes: Node[]; edges: Edge[] }) => {
            edgs.forEach((edge) => {
                const sourceNode = nodes.find(
                    (node) => node.id === edge.source
                );
                const targetNode = nodes.find(
                    (node) => node.id === edge.target
                );

                if (sourceNode && targetNode) {
                    const sourceObject: TerraNode = sourceNode.data.object;
                    const targetObject: TerraNode = targetNode.data.object;

                    const sourceName = sourceObject.getNodeType();
                    const targetName = targetObject.getNodeType();

                    if (sourceName == "Proxmox" && targetName == "Network") {
                        const proxmox: ProxmoxProvider =
                            sourceObject as ProxmoxProvider;
                        const network: Network = targetObject as Network;
                        proxmox.removeNetwork(network);
                    } else if (
                        sourceName == "Network" &&
                        targetName == "Virtual Machine"
                    ) {
                        const network: Network = sourceObject as Network;
                        const virtualMachine: VirtualMachine =
                            targetObject as VirtualMachine;

                        network.removeMachine(virtualMachine);
                    }
                }
            });

            nds.forEach((n: any) => {
                const nodeObject: TerraNode = n.data.object;
                const nodeType = nodeObject.getNodeType();
                if (nodeType == "Proxmox") {
                    config.removeProvider(nodeObject as ProxmoxProvider);
                }
            });
        },
        [nodes, config]
    );

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

    const handleImport = useCallback((importedConfig: Configuration) => {
        setConfig(importedConfig);
        vmServiceRef.current = new VMService(importedConfig);
        setVmTemplates([...vmServiceRef.current.getAllVMTemplates()]);
        const { nodes: newNodes, edges: newEdges } =
            createNodesAndEdges(importedConfig);
        setNodes(newNodes as any);
        setEdges(newEdges as any);
    }, []);

    return (
        <ReactFlowProvider>
            <ImportModal
                opened={importModalOpened}
                onClose={() => setImportModalOpened(false)}
                onImport={handleImport}
            />
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
function setHeaderContent(arg0: JSX.Element) {
    throw new Error("Function not implemented.");
}
