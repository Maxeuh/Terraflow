"use client";

import { Burger, Center, Group, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import classes from "./Header.module.css";
import { useHeaderContent } from "./HeaderContext";

interface LinkItem {
    link: string;
    label: string;
    links?: Array<{ link: string; label: string }>;
}

const links: LinkItem[] = [
    { link: "/about", label: "About" },
    /*
    {
        link: "",
        label: "Learn",
        links: [
            { link: "/docs", label: "Documentation" },
            { link: "/resources", label: "Resources" },
            { link: "/community", label: "Community" },
            { link: "/blog", label: "Blog" },
        ],
    },
    */
];

interface HeaderProps {
    children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
    const [opened, { toggle }] = useDisclosure(false);
    const { headerContent } = useHeaderContent();

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>
                <Link href={item.link}>{item.label}</Link>
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu
                    key={link.label}
                    trigger="hover"
                    transitionProps={{ exitDuration: 0 }}
                    withinPortal
                >
                    <Menu.Target>
                        <Link href={link.link} className={classes.link}>
                            <Center>
                                <span className={classes.linkLabel}>
                                    {link.label}
                                </span>
                                <FaChevronDown size={14} />
                            </Center>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link key={link.label} href={link.link} className={classes.link}>
                {link.label}
            </Link>
        );
    });

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Link href="/" className={classes.logo}>
                    <Image
                        width={28}
                        height={28}
                        src="/logo.png"
                        alt="Terraflow Logo"
                    />
                    <Text size="xl" fw={700}>
                        Terraflow
                    </Text>
                </Link>
                <Group gap={5}>{headerContent}</Group>
                <Group gap={5}>{items}</Group>
                {opened && <div className={classes.mobileNav}>{items}</div>}
                <Burger
                    opened={opened}
                    onClick={toggle}
                    size="sm"
                    hiddenFrom="sm"
                />
            </div>
        </header>
    );
}
