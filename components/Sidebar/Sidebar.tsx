"use client";

import { LinksGroup } from "@/components/LinksGroup/LinksGroup";
import { ScrollArea } from "@mantine/core";
import { PiComputerTowerBold, PiNetwork, PiPlusBold } from "react-icons/pi";
import { SiProxmox } from "react-icons/si";
import classes from "./Sidebar.module.css";

const mockdata = [
    {
        label: "Proxmox",
        icon: SiProxmox,
        initiallyOpened: true,
        links: [{ label: "Overview", link: "/" }],
    },
    {
        label: "Networks",
        icon: PiNetwork,
        initiallyOpened: true,
        links: [{ label: "Overview", link: "/" }],
    },
    {
        label: "Virtual Machines",
        icon: PiComputerTowerBold,
        initiallyOpened: true,
        links: [{ label: "Overview", link: "/" }],
    },
];

export function Sidebar() {
    const links = mockdata.map((item) => (
        <LinksGroup {...item} key={item.label} />
    ));

    return (
        <nav className={classes.navbar}>
            <ScrollArea className={classes.links}>
                <LinksGroup key="New" label="New" icon={PiPlusBold} />
                <div>{links}</div>
            </ScrollArea>
        </nav>
    );
}
