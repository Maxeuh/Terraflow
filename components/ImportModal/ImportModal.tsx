import { importFromJson } from "@/util/export_import";
import {
    Button,
    Flex,
    Modal,
    Progress,
    rgba,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { useRef, useState } from "react";

interface ImportModalProps {
    opened: boolean;
    onClose: () => void;
    onImport: (config: any) => void;
}

export function ImportModal({ opened, onClose, onImport }: ImportModalProps) {
    const theme = useMantineTheme();
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setProgress(25);
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                setProgress(100);
                if (event.target?.result) {
                    const jsonContent = event.target.result as string;
                    const config = importFromJson(jsonContent);
                    onImport(config);
                    setLoaded(true);
                    setTimeout(() => {
                        onClose();
                        // Reset states after closing
                        setProgress(0);
                        setLoaded(false);
                    }, 1000);
                }
            } catch (err) {
                setError(
                    "Erreur lors de l'importation du fichier. Assurez-vous qu'il s'agit d'un fichier Terraflow valide."
                );
                setProgress(0);
                console.error(err);
            }
        };

        reader.onerror = () => {
            setError("Erreur lors de la lecture du fichier.");
            setProgress(0);
        };

        reader.readAsText(file);
    };

    const handleButtonClick = () => {
        if (loaded) {
            setLoaded(false);
            setProgress(0);
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleDrop = (files: File[]) => {
        if (files.length === 0) return;
        setProgress(25);
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                setProgress(100);
                if (event.target?.result) {
                    const jsonContent = event.target.result as string;
                    const config = importFromJson(jsonContent);
                    onImport(config);
                    setLoaded(true);
                    setTimeout(() => {
                        onClose();
                        // Reset states after closing
                        setProgress(0);
                        setLoaded(false);
                    }, 1000);
                }
            } catch (err) {
                setError(
                    "Erreur lors de l'importation du fichier. Assurez-vous qu'il s'agit d'un fichier Terraflow valide."
                );
                setProgress(0);
                console.error(err);
            }
        };

        reader.onerror = () => {
            setError("Erreur lors de la lecture du fichier.");
            setProgress(0);
        };

        reader.readAsText(file);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Importer une configuration Terraflow"
            size="md"
        >
            <Text c="dimmed" size="sm">
                Sélectionnez un fichier JSON exporté depuis Terraflow pour
                restaurer votre configuration.
            </Text>

            {error && (
                <Text c="red" mb="md">
                    {error}
                </Text>
            )}

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="application/json"
                onChange={handleFileChange}
            />

            <Flex justify="space-between" align="center" gap="sm" mt="md">
                <Button
                    flex={1}
                    onClick={handleButtonClick}
                    color={loaded ? "teal" : theme.primaryColor}
                    style={{
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ position: "relative", zIndex: 1 }}>
                        {progress !== 0 && progress !== 100
                            ? "Importation en cours"
                            : loaded
                            ? "Fichier importé"
                            : "Importer un fichier"}
                    </div>
                    {progress !== 0 && (
                        <Progress
                            value={progress}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "100%",
                                zIndex: 0,
                            }}
                            color={rgba(
                                theme.colors[theme.primaryColor][2],
                                0.35
                            )}
                        />
                    )}
                </Button>

                <Button variant="outline" onClick={onClose}>
                    Annuler
                </Button>
            </Flex>
        </Modal>
    );
}
