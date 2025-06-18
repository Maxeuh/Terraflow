"use client";

import { CreateModal } from "@/components/CreateModal/CreateModal";
import { LinksGroup } from "@/components/LinksGroup/LinksGroup";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";
import { ScrollArea } from "@mantine/core";
import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { PiComputerTowerBold, PiNetwork, PiPlusBold } from "react-icons/pi";
import { SiProxmox } from "react-icons/si";
import classes from "./Sidebar.module.css";

interface SidebarProps {
    onOpenVMTemplateDrawer: () => void;
    vmTemplates?: VirtualMachineTemplate[];
}

export function Sidebar({
    onOpenVMTemplateDrawer,
    vmTemplates = [],
}: SidebarProps) {
    const [modalOpened, setModalOpened] = useState(false);
    const [modalType, setModalType] = useState("");

    const flowInstance = useReactFlow<Node, Edge>();

    const openModal = (type: string) => {
        setModalType(type);
        setModalOpened(true);
    };

    const closeModal = () => {
        setModalOpened(false);
    };

    const handleSubmit = (name: string, openSettings: boolean) => {
        closeModal();
        const newNode: Node = {
            id: `node-${Date.now()}`,
            position: { x: 0, y: 0 },
            data: { label: name },
            type: "virtualMachine"
        };
        flowInstance.addNodes(newNode);
        flowInstance.fitView();
    };

    const vmTemplateLinks = vmTemplates.map((template) => ({
        label: template.name,
        onClick: () => {
            openModal(`"${template.name}" VM`);
        },
    }));

    return (
        <nav className={classes.navbar}>
            <ScrollArea className={classes.links}>
                <LinksGroup
                    key="Proxmox"
                    label="Proxmox"
                    icon={SiProxmox}
                    onClick={() => openModal("Proxmox")}
                />
                <LinksGroup
                    key="Network"
                    label="Network"
                    icon={PiNetwork}
                    onClick={() => openModal("Network")}
                />
                <LinksGroup
                    key="New VM Template"
                    label="New VM Template"
                    icon={PiPlusBold}
                    onClick={onOpenVMTemplateDrawer}
                />
                <LinksGroup
                    key="Virtual Machines"
                    label="Virtual Machines"
                    icon={PiComputerTowerBold}
                    initiallyOpened={true}
                    forceChevron={true}
                    links={vmTemplateLinks}
                />
            </ScrollArea>
            <CreateModal
                opened={modalOpened}
                onClose={closeModal}
                onSubmit={handleSubmit}
                type={modalType}
            />
        </nav>
    );
}
