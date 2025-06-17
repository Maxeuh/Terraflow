"use client";

import {
    Box,
    Collapse,
    Group,
    Text,
    ThemeIcon,
    UnstyledButton,
} from "@mantine/core";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import classes from "./LinksGroup.module.css";

interface LinksGroupProps {
    icon: React.FC<any>;
    label: string;
    initiallyOpened?: boolean;
    links?: { label: string; link: string }[];
}

export function LinksGroup({
    icon: Icon,
    label,
    initiallyOpened,
    links,
}: LinksGroupProps) {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const items = (hasLinks ? links : []).map((link) => (
        <Text<"a">
            component="a"
            className={classes.link}
            href={link.link}
            key={link.label}
            unstyled={true}
        >
            {link.label}
        </Text>
    ));

    return (
        <>
            <UnstyledButton
                onClick={() => setOpened((o) => !o)}
                className={classes.control}
                unstyled={true}
            >
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon size={18} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
                    </Box>
                    {hasLinks && (
                        <FaChevronRight
                            className={classes.chevron}
                            size={16}
                            style={{
                                transform: opened ? "rotate(90deg)" : "none",
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}
