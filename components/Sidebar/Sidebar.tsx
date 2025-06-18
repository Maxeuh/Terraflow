"use client";

import { CreateModal } from "@/components/CreateModal/CreateModal";
import { LinksGroup } from "@/components/LinksGroup/LinksGroup";
import { Network } from "@/util/network";
import { ProxmoxProvider } from "@/util/proxmox";
import { TerraNode } from "@/util/types";
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
    const [modalType, setModalType] = useState<TerraNode>();

    const flowInstance = useReactFlow<Node, Edge>();

    const openModal = (object: TerraNode) => {
        setModalType(object);
        setModalOpened(true);
    };

    const closeModal = () => {
        setModalOpened(false);
    };

    const handleSubmit = (object: TerraNode, openSettings: boolean) => {
        closeModal();
        console.log("Submitted object:", object);
        const newNode: Node = {
            id: `node-${Date.now()}`,
            position: { x: 0, y: 0 },
            data: { label: object.name },
        };
        flowInstance.addNodes(newNode);
        flowInstance.fitView();
    };

    const vmTemplateLinks = vmTemplates.map((template) => ({
        label: template.name,
        onClick: () => {
            openModal(template);
        },
    }));

    return (
        <nav className={classes.navbar}>
            <ScrollArea className={classes.links}>
                <LinksGroup
                    key="Proxmox"
                    label="Proxmox"
                    icon={SiProxmox}
                    onClick={() => openModal(new ProxmoxProvider())}
                />
                <LinksGroup
                    key="Network"
                    label="Network"
                    icon={PiNetwork}
                    onClick={() => openModal(new Network())}
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
            {modalType && (
                <CreateModal
                    opened={modalOpened}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    object={modalType}
                />
            )}
        </nav>
    );
}
