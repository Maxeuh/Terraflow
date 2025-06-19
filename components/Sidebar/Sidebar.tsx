"use client";

import { CreateModal } from "@/components/CreateModal/CreateModal";
import { LinksGroup } from "@/components/LinksGroup/LinksGroup";
import { Configuration } from "@/util/configuration";
import { Network } from "@/util/network";
import { ProxmoxProvider } from "@/util/proxmox";
import { TerraNode } from "@/util/types";
import { VirtualMachine } from "@/util/virtual_machine";
import { VirtualMachineTemplate } from "@/util/virtual_machine_template";
import { Menu, ScrollArea, Text } from "@mantine/core";
import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { PiComputerTowerBold, PiNetwork, PiPlusBold } from "react-icons/pi";
import { SiProxmox } from "react-icons/si";
import classes from "./Sidebar.module.css";

interface SidebarProps {
    config: Configuration;
    onOpenVMTemplateDrawer: () => void;
    onEditVMTemplate: (template: VirtualMachineTemplate) => void;
    onDeleteVMTemplate: (template: VirtualMachineTemplate) => void;
    vmTemplates?: VirtualMachineTemplate[];
}

export function Sidebar({
    config,
    onOpenVMTemplateDrawer,
    onEditVMTemplate,
    onDeleteVMTemplate,
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

    const handleSubmit = (object: TerraNode) => {
        closeModal();
        const newNode: Node = {
            id: `node-${Date.now()}`,
            position: {
                x: 50,
                y: 50,
            },
            data: { object },
            type: object.getNodeType(),
        };

        if (object.getNodeType() == "Proxmox") {
            config.addProvider(object as ProxmoxProvider);
            console.log(config);
        }

        flowInstance.addNodes(newNode);
    };

    const vmTemplateLinks = vmTemplates.map((template) => {
        const vm = new VirtualMachine(template);
        const key = `${template.getUUID()}-${template.name}`;

        return (
            <Menu
                width={200}
                offset={3}
                position="bottom-start"
                withArrow
                arrowPosition="side"
                key={key}
            >
                <Menu.Target>
                    <Text className={classes.link} unstyled={true}>
                        {vm.name_resource || template.name || "Sans nom"}
                    </Text>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<PiPlusBold />}
                        onClick={() => openModal(vm)}
                    >
                        Create
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<MdEdit />}
                        onClick={() => onEditVMTemplate(template)}
                    >
                        Edit
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<MdDelete />}
                        onClick={() => onDeleteVMTemplate(template)}
                    >
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        );
    });

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
