"use client";

import { Burger, Center, Container, Group, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import classes from "./header.module.css";

const links = [
    { link: "/about", label: "Features" },
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
];

export function Header() {
    const [opened, { toggle }] = useDisclosure(false);

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
            <Container size="md">
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
                    <Group gap={5} visibleFrom="sm">
                        {items}
                    </Group>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        size="sm"
                        hiddenFrom="sm"
                    />
                </div>
            </Container>
        </header>
    );
}
