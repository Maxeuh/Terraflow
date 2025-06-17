"use client";

import { LinksGroup } from "@/components/linksgroup/LinksGroup";
import { ScrollArea } from "@mantine/core";
import { PiComputerTowerBold, PiNetwork } from "react-icons/pi";
import { SiProxmox } from "react-icons/si";
import { TbDashboard } from "react-icons/tb";
import classes from "./Sidebar.module.css";

const mockdata = [
    { label: "Dashboard", icon: TbDashboard },
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
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>
        </nav>
    );
}
