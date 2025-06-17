"use client";

import SettingsDrawer from "@/components/SettingsDrawer/SettingsDrawer";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { FieldType, FormField } from "@/util/types";
import { Flex } from "@mantine/core";
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState } from "react";

export default function Home() {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [drawerOpened, setDrawerOpened] = useState(false);
    const [drawerType, setDrawerType] = useState("");
    const [formFields, setFormFields] = useState<FormField[]>([]);

    const openDrawer = (title: string, forms: FormField[]) => {
        setDrawerType(title);
        setFormFields(forms);
        setDrawerOpened(true);
    };

    const openVMTemplateDrawer = () => {
        const emptyForm: FormField[] = [
            {
                name: "name",
                value: "",
                type: FieldType.String,
                regex: /^.+$/,
                mandatory: true,
            },
            {
                name: "ip",
                value: "",
                type: FieldType.String,
                regex: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                mandatory: false,
            },
        ];
        openDrawer("VM Template (Test)", emptyForm);
    };

    const closeDrawer = () => {
        setDrawerOpened(false);
        console.log(`Drawer closed for ${drawerType}`);
    };

    const handleDrawerSubmit = (updatedFields: FormField[]) => {
        setDrawerOpened(false);
        console.log(`Form submitted for ${drawerType}:`, updatedFields);
    };

    return (
        <ReactFlowProvider>
            <Flex flex={"row"} direction={"row"}>
                <Sidebar onOpenVMTemplateDrawer={openVMTemplateDrawer} />
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
                    >
                        <Controls />
                        <Background variant={BackgroundVariant.Dots} />
                    </ReactFlow>
                </div>
            </Flex>
        </ReactFlowProvider>
    );
}
