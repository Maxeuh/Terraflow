"use client";

import NetworkNode from "@/components/Nodes/NetworkNode";
import ProxmoxNode from "@/components/Nodes/ProxmoxNode";
import VirtualMachineNode from "@/components/Nodes/VirtualMachineNode";
import { SettingsDrawer } from "@/components/SettingsDrawer/SettingsDrawer";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Configuration } from "@/util/configuration";
import { FormField } from "@/util/types";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";
import { VMService } from "@/util/virtual_machine_template_service";
import { Flex } from "@mantine/core";
import {
    Background,
    BackgroundVariant,
    Controls, NodeTypes,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";

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

    const config = new Configuration();
    const vmServiceRef = useRef(new VMService(config));
    const [vmTemplates, setVmTemplates] = useState<VirtualMachineTemplate[]>(
        []
    );
    const [currentTemplate, setCurrentTemplate] =
        useState<VirtualMachineTemplate | null>(null);

    useEffect(() => {
        const vmService = vmServiceRef.current;

        const handleTemplatesUpdated = (
            templates: VirtualMachineTemplate[]
        ) => {
            setVmTemplates(templates);
            console.log("VM Templates updated:", templates);
        };

        vmService.on("templates-updated", handleTemplatesUpdated);

        setVmTemplates(vmService.getAllVMTemplates());

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

    const openVMTemplateDrawer = useCallback(() => {
        const template = vmServiceRef.current.createVMTemplate();
        setCurrentTemplate(template);
        openDrawer("Create VM Template", template.getFormFields());
    }, [openDrawer]);

    const closeDrawer = useCallback(() => {
        setDrawerOpened(false);
        setCurrentTemplate(null);
        console.log(`Drawer closed for ${drawerType}`);
    }, [drawerType]);

    const handleDrawerSubmit = useCallback(
        (updatedFields: FormField[]) => {
            if (currentTemplate) {
                vmServiceRef.current.addVMTemplate(
                    currentTemplate,
                    updatedFields
                );
            }
            setDrawerOpened(false);
            setCurrentTemplate(null);
        },
        [currentTemplate]
    );

    return (
        <ReactFlowProvider>
            <Flex flex={"row"} direction={"row"}>
                <Sidebar
                    onOpenVMTemplateDrawer={openVMTemplateDrawer}
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
