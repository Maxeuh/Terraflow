"use client";

import {
    Badge,
    Button,
    Card,
    Container,
    Grid,
    Group,
    Image,
    LoadingOverlay,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa6";

interface Contributor {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

export default function Home() {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/contributors");
                const data: Contributor[] = await response.json();
                setContributors(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error(err.message);
                    setError(
                        err.message ||
                            "An error occurred while fetching contributors."
                    );
                } else if (typeof err === "string") {
                    console.error(err);
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchContributors();
    }, []);

    return (
        <>
            <LoadingOverlay visible={loading} />

            <Container size="md" py="xl">
                <Stack align="center" gap="xl">
                    <Title order={1} mt="lg">
                        About the project
                    </Title>

                    {error && <Text c="red">{error}</Text>}

                    <Grid w="100%" gutter="md">
                        {contributors.map((contributor) => (
                            <Grid.Col
                                key={contributor.id}
                                span={{ base: 12, xs: 6, sm: 4, md: 3 }}
                            >
                                <Card
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                >
                                    <Card.Section>
                                        <Image
                                            src={contributor.avatar_url}
                                            height={100}
                                            alt={contributor.login}
                                        />
                                    </Card.Section>

                                    <Group
                                        justify="space-between"
                                        mt="md"
                                        mb="xs"
                                    >
                                        <Text size="lg" fw={800}>
                                            {contributor.login}
                                        </Text>
                                        <Badge>
                                            {`${contributor.contributions} ${
                                                contributor.contributions > 1
                                                    ? "contributions"
                                                    : "contribution"
                                            }`}
                                        </Badge>
                                    </Group>

                                    <Button
                                        component="a"
                                        href={contributor.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        fullWidth
                                        mt="md"
                                        radius="md"
                                    >
                                        View Profile
                                    </Button>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>

                    <Button
                        component="a"
                        href="https://github.com/Maxeuh/Terraflow"
                        variant="filled"
                        size="md"
                        radius="md"
                    >
                        <FaGithub style={{ marginRight: 8 }} /> Contribute on
                        GitHub
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
